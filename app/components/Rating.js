import React from "react";

//import styles and assets
import styled from "styled-components";
import color from "../config/color";
import  FontAwesome  from "react-native-vector-icons/FontAwesome";
import * as Typography from "../config/Typography";

const Rating = ({ rating, reviews }) => {
  return (
    <Container>
      <FontAwesome name="star" color={color.green} />
      <Typography.P color={color.black}>{rating}</Typography.P>
      <Typography.P color={color.gray}>{` (${reviews})`}</Typography.P>
    </Container>
  );
};

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default Rating;
