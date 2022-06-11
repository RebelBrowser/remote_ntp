import React from 'react';
import styled from 'styled-components';
import PanelNavigator from './PanelNavigator';
import { Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

const FormNavigatorWrapper = styled.div`
  display: inline-block;

  width: 175px;

  margin-top: 50px;

  vertical-align: top;
`;

const BackButtonWrapper = styled.div`
  width: 36px;
  height: 36px;

  margin-inline-start: -12px;
  margin-inline-end: 4px;

  border-radius: 50%;

  outline: none;

  &:hover {
    background-color: ${(props) => props.theme.palette.hover.background};
    background-position: center;
    background-size: 36px 36px;
  }
`;

const BackButton = styled(ArrowBack)`
  fill: ${(props) =>
    props.theme.browser.darkModeEnabled
      ? 'white'
      : props.theme.palette.primary.main};

  width: 20px;
  height: 20px;

  margin-top: 8px;

  cursor: pointer;
  outline: none;

  -webkit-mask-size: 20px;
  -webkit-mask-repeat: no-repeat;
`;

// Prettier formats the dynamic CSS rules based on |props| really badly.
// prettier-ignore
const ThemeFormContainer = styled.div`
  min-width: 320px;
  min-height: 100px;

  padding-left: 10px;
  padding-right: 10px;

  z-index: 10000;

  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.modal ? `
    &:before {
      background-color: black;

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      content: '';
      opacity: 0.5;
    }` : ``};

  position: fixed;
  left: 0;
  right: 0;

  ${(props) => props.align === 'top' ? `
    top: 15px;
  ` : props.align === 'bottom' ? `
    bottom: 50px;
  ` : `
    top: 0;
    bottom: 0;
  `};
`;

// prettier-ignore
const ThemeForm = styled.dialog`
  ${(props) => props.modal ? `
    color: ${props.theme.palette.background.main};
    background-color: ${props.theme.palette.background.main};
  ` : `
    color: ${props.theme.inverted.palette.background.main};
    background-color: ${props.theme.inverted.palette.background.main};
  `};

  display: flex;
  position: relative;

  border: none;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadows[3]};

  margin: auto;
  padding: 16px 16px 16px 0px;

  &::backdrop {
    background: transparent;
  }
`;

const FormContent = styled.div`
  display: inline-block;
  position: relative;

  margin-inline-start: 16px;
  margin-bottom: 32px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: flex-start;

  margin-top: -8px;
`;

const FormTitle = styled.div`
  font-weight: 490;
  padding-left: 5px;
  line-height: 36px;
  margin-bottom: 5px;
  margin-top: 7px;
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormFooter = styled.div`
  width: calc(100% - 32px);

  position: absolute;
  bottom: 0;
  left: 0;

  margin-inline-start: 16px;
  margin-inline-end: -32px;
  margin-bottom: 14px;

  user-select: none;
`;

export default function FormView(props) {
  const panels =
    props.panels && props.panels.length > 1 ? (
      <FormNavigatorWrapper>
        {props.panels.map((panel, index) => (
          <PanelNavigator
            key={index}
            index={index}
            text={panel.title}
            icon={panel.icon}
            active={index === props.activePanel}
            onClick={(index) => props.onPanelChange(index)}
          />
        ))}
      </FormNavigatorWrapper>
    ) : null;

  const body = props.panels ? props.panels[props.activePanel].body : null;

  const backButton = props.backButtonAction ? (
    <BackButtonWrapper
      tabIndex="0"
      role="button"
      aria-label="Back"
      onClick={(e) => props.onBackButton(e)}
    >
      <BackButton onDragStart={(e) => e.preventDefault()} />
    </BackButtonWrapper>
  ) : null;

  return (
    <ThemeFormContainer
      id="themed-form-container"
      modal={props.modal}
      align={props.align}
      onClick={(e) => props.handleCloseClick(e)}
    >
      <ThemeForm modal={props.modal} open>
        {panels}

        <FormContent>
          <FormHeader>
            {backButton}
            <FormTitle>
              <Typography variant="h1">{props.title}</Typography>
            </FormTitle>
          </FormHeader>

          <FormBody>{body}</FormBody>
        </FormContent>

        <FormFooter>
          <form id={props.formId} onSubmit={(e) => props.onSubmit(e)}>
            {props.buttons}
          </form>
        </FormFooter>
      </ThemeForm>
    </ThemeFormContainer>
  );
}
