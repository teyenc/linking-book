import React from "react";
import { View, ScrollView } from "react-native";

//import components
import VideoInput from "./VideoInput";

//import styles and assets
import styled from "styled-components";
import Colors from "../config/colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const VideoInputList = ({ imageUris = [], onRemoveImage, onAddImage }) => {
  return (
    <ScrollView horizontal>
      <Container>
        {imageUris.map((uri) => (
          <View key={uri} style={{ marginRight: 10 }}>
            <VideoInput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          </View>
        ))}
        <VideoInput onChangeImage={(uri) => onAddImage(uri)} />
      </Container>
    </ScrollView>
  );
};

const Container = styled.View`
  flex-direction: row;
`;

export default VideoInputList;
