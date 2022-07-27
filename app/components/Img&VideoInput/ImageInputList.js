import React from "react";
import { View, ScrollView } from "react-native";

//import components
import ImageInput from "./ImageInput"

//import styles and assets
import styled from "styled-components";
// import color from "../../config/color";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const ImageInputList = ({ imageUris = [], onRemoveImage, onAddImage }) => {
  return (
    <ScrollView horizontal>
      <Container>
        {imageUris.map((uri) => (
          <View key={uri} style={{ marginRight: 10 }}>
            <ImageInput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          </View>
        ))}
        <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
      </Container>
    </ScrollView>
  );
};


const Container = styled.View`
  flex-direction: row;
`;

export default ImageInputList;
