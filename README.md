# Rebel Browser Remote New Tab Page

The default New Tab Page used by the Rebel browser.

## Setup

```bash
git clone https://github.com/RebelBrowser/remote_ntp.git
cd remote_ntp
npm install
```

## Running

```bash
npm start
```

This will open a new tab in your browser to http://localhost:3000. However, the
page won't render much, if anything at all. This is because the application
depends on APIs embedded by the browser, which are not embedded by default.

To point the browser at your running localhost instance, run the browser with
these command lines (shown here for macOS):

```bash
./out/Release/Rebel.app/Contents/MacOS/Rebel --remote-ntp-url=http://localhost:3000/rebel_ntp/index.html
```

Note: You do not need to re-run `npm start` each time you make a change to the
source code. Anytime you save a file, `npm` will automatically rebuild the site
and refresh any active open sessions.

## Deploying

To deploy to browser.viasat.com/rebel_ntp_dev:

```bash
./deploy.py -t dev
```

To deploy to browser.viasat.com/rebel_ntp:

```bash
./deploy.py -t prod
```

To create a local build of the NTP to be embedded into the browser at compile
time (accessed at chrome://remote-ntp-offline):

```bash
./deploy.py -t local
```
