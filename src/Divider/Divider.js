/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Divider } from '@material-ui/core';
import styled from 'styled-components';

const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.palette.primary.main};
  width: 94.5%;
  margin: auto;
  margin-top: 4vh;
  height: 0.5px;

  @media (max-width: 600px) {
    width: 92%;
  }
`;

const generateDivider = () => <StyledDivider />;

export default generateDivider;
