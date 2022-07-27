import React from "react";
import { Platform } from "react-native";

//import styles and assets
import styled from "styled-components";
import color from "../../config/color";

const ErrorMessage = ({ error, visible }) => {
  if (!visible || !error) return null;
  return <ErrorText>{error}</ErrorText>;
};

const ErrorText = styled.Text`
  font-size: ${Platform.OS === "android" ? "14px" : "12px"};
  color: ${color.green};
  margin-top: 6px;
`;
export default ErrorMessage;
