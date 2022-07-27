import React, { useEffect } from "react";
import { Image, TouchableWithoutFeedback, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";

//import styles and assets
import styled from "styled-components";
import Colors from "../config/colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";

// const ImgInput = ({ imageUri, onChangeImage }) => {
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
//       Alert.alert("Delete", "Do you want to delete the Photo?", [
//         { text: "Yes", onPress: () => onChangeImage() },
//         { text: "no" },

//       ]);
//   };

//   const selectImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true ,
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
//         {!imageUri && <EvilIcons name="camera" size={40} color={Colors.gray} />}
//         {imageUri && <ImageContainer source={{ uri: imageUri }} />}
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

export default ImgInput;
