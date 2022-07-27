import React from "react";
import { View, ScrollView } from "react-native";

//import components
import ImageInput from "./VideoInput";
import ImgInput from "./ImgInput";

//import styles and assets
import styled from "styled-components";
import Colors from "../config/colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const ImgInputList = ({ imageUris = [], onRemoveImage, onAddImage }) => {
  return (
    <ScrollView horizontal>
      <Container>
        {imageUris.map((uri) => (
          <View key={uri} style={{ marginRight: 10 }}>
            <ImgInput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          </View>
        ))}
        <ImgInput onChangeImage={(uri) => onAddImage(uri)} />
      </Container>
    </ScrollView>
  );
};

const Container = styled.View`
  flex-direction: row;
`;

export default ImgInputList;
