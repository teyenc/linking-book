import React, { useEffect } from "react";
import { Image, TouchableWithoutFeedback, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";

//import styles and assets
import styled from "styled-components";
import Colors from "../config/colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { ResizeMode, Video } from "expo-av";

// const VideoInput = ({ imageUri, onChangeImage }) => {
//   useEffect(() => {
//     requstPermission();
//   }, []);

//   const requstPermission = async () => {
//     const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
//     // if (!granted) alert("Approval is required");
//   };

//   const handlePress = () => {
//     if (!imageUri) selectImage();
//     else
//       Alert.alert("Delete", "Do you want to delete the Video?", [
//         { text: "no" },
//         { text: "Yes", onPress: () => onChangeImage() },
//       ]);
//   };

//   const selectImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Videos, 
//         // allowsMultipleSelection: true ,
//         // mediaTypes:ImagePicker.MediaTypeOptions.Images,
//         quality: 0.5,
//       });
//       if (!result.cancelled) onChangeImage(result.uri);
//     } catch (error) {
//       console.log("error reading an iamge");
//     }
//   };



//   return (
//     <TouchableWithoutFeedback onPress={handlePress}>
//       <Container>
//         {!imageUri && <EvilIcons name="play" size={40} color={Colors.gray} />}
//         {imageUri && <Video style={{width: "100%", height: "100%", ResizeMode:"contain"}} source={{ uri: imageUri }} />}
//       </Container>
//     </TouchableWithoutFeedback>
//   );
// };

const Container = styled.View`
  background-color: ${Colors.faintgray};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 100px;
  width: 100px;
`;

const ImageContainer = styled.Image`
  width: 100%;
  height: 100%;
`;

export default VideoInput;
