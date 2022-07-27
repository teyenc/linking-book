import React from "react";
import { Dimensions, View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");

const ImgSliderItems = ({ item, navigation, route }) => {
  // const listing = route.params; 
  return (
    // <TouchableOpacity onPress={() => navigation.navigate("Photos", listing)}>


    <View style={{alignContent:"center",}} >
      <Image style={styles.image} source={{ uri: item }} />
    </View>
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: width*0.9,
    alignContent:"center",
    resizeMode: "cover",
  },
});

export default ImgSliderItems;
