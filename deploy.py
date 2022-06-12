#!/usr/bin/env python3
"""
Build and deploy React applications to AWS S3.

Examples
--------
Deploy targets to staging S3 buckets:
python3 deploy.py -t dev

Deploy targets to production S3 buckets:
python3 deploy.py -t prod
"""
import argparse
import logging
import codecs
import json
import mimetypes
import os
import subprocess


logging.basicConfig(
    format='%(asctime)s %(funcName)-15s ::%(levelname)s: %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p',
    level=logging.INFO)

NTP_TARGETS = {
    'local': {
        'scheme': 'chrome-search',
        'homepage': 'remote-ntp-offline',
    },
    'dev': {
        'scheme': 'https',
        'homepage': 'browser.viasat.com/rebel_ntp_dev',
    },
    'prod': {
        'scheme': 'https',
        'homepage': 'browser.viasat.com/rebel_ntp',
    },
}

WORKING_DIR = os.path.dirname(os.path.realpath(__file__))
os.chdir(WORKING_DIR)

# Grit requires the generated GRDP file be relative to the main GRD file which
# include it. This is from //rebel/chrome/browser/resources/rebel_resources.grd
# to //rebel/third_party/remote_ntp/remote_ntp_resources.grdp.
PATH_RELATIVE_TO_GRD = '../../../third_party/remote_ntp'


def run_command(command_list):
    """
    Wrapper around subprocess.run to capture and print stdout/stderr, even if
    the command fails.
    """
    logging.info('Calling: %s', command_list)

    try:
        result = subprocess.run(
            command_list, universal_newlines=True, check=True,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as ex:
        print(ex.output)
        raise

    print(result.stdout)


def set_homepage(package, scheme, homepage):
    """
    Set the target homepage in the React application's package.json.
    """
    package = os.path.join(WORKING_DIR, package)
    homepage = '%s://%s' % (scheme, homepage)

    logging.info('Setting homepage (%s): %s', package, homepage)

    with open(package, 'r+') as package_file:
        data = json.load(package_file)

        data['name'] = homepage.split('/')[-1]
        data['homepage'] = homepage

        package_file.seek(0)
        json.dump(data, package_file, indent=2, sort_keys=True)
        package_file.write('\n')
        package_file.truncate()


def generate_rebel_sources():
    """
    Generate the XML/C++ entries needed to reflect the newly built target.
    """
    path = os.path.join(WORKING_DIR, 'build')
    sources = []

    for (root, _, files) in os.walk(path):
        root = root.replace(path + '/', '', 1).replace(path, '', 1)

        for file in files:
            mime_type = mimetypes.guess_type(file)[0]
            if not mime_type:
                (_, ext) = os.path.splitext(file)

                # Handle .map files as JSON. These files are used by dev tools.
                if ext == '.map':
                    mime_type = 'application/json'
                else:
                    continue

            file_path = os.path.join(root, file)
            identifier = file_path

            for c in ['.', '-', '/']:
                identifier = identifier.replace(c, '_')

            sources.append({
                'file_path': file_path,
                'identifier': 'IDR_REMOTE_NTP_' + identifier.upper(),
                'mime_type': mime_type,
            })

    # Generate remote_ntp_resources.grdp
    resources_path = os.path.join(WORKING_DIR, 'remote_ntp_resources.grdp')

    with open(resources_path, 'w') as resources_file:
        resources_file.write('<?xml version="1.0" encoding="utf-8"?>\n')
        resources_file.write('<grit-part>\n')

        for source in sources:
            path = f'{PATH_RELATIVE_TO_GRD}/build/{source["file_path"]}'
            identifier = source['identifier']

            xml = f'<include name="{identifier}" file="{path}" type="BINDATA" />'
            resources_file.write('  ' + xml + '\n')

        resources_file.write('</grit-part>\n')

    # Generate remote_ntp_offline_resources.h
    resources_path = os.path.join(
        WORKING_DIR, 'remote_ntp_offline_resources.h')

    with open(resources_path, 'w') as resources_file:
        resources_file.write('namespace rebel {\n\n')
        resources_file.write(
            'const RemoteNtpOfflineResource kRemoteNtpOfflineResources[] = {\n')

        for source in sources:
            path = source['file_path']
            identifier = source['identifier']
            mime_type = source['mime_type']

            cpp = f'{{ {identifier}, "{path}", "{mime_type}" }},\n'
            resources_file.write('    ' + cpp)

        resources_file.write('};\n\n')
        resources_file.write(
            f'const size_t kRemoteNtpOfflineResourcesSize = {len(sources)};\n\n')
        resources_file.write('}  // namespace rebel\n')


def main():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description=__doc__)

    req = parser.add_argument_group('required arguments')
    req.add_argument(
        '-t', '--target', dest='target', choices=list(NTP_TARGETS.keys()),
        type=str, required=True, help='Target environment to deploy to.')

    args = parser.parse_args()

    logging.info('Deploying target: %s', args.target)

    # Install NPM dependencies
    run_command(['npm', 'install', '--production'])

    target_info = NTP_TARGETS[args.target]
    scheme = target_info['scheme']
    homepage = target_info['homepage']

    # Set proper homepage in package.json
    set_homepage('package.json', scheme, homepage)

    # Build React app
    run_command(['npm', 'run-script', 'build'])

    if args.target == 'local':
        generate_rebel_sources()
    else:
        # Upload built React app to S3
        run_command(
            ['aws', 's3', 'sync', './build', 's3://' + homepage, '--acl=public-read'])

    # Reset the package.json file
    run_command(['git', 'checkout', 'HEAD', 'package.json'])
    run_command(['git', 'checkout', 'HEAD', 'package-lock.json'])

    logging.info('Finished deployment to target "%s"', args.target)


if __name__ == '__main__':
    main()
