import React from "react";
import { Dimensions, View, StyleSheet, FlatList, Image } from "react-native";


//import components
import ImgSliderItem from "../components/ImgSliderItem";
import Rating from "../components/Rating";

//import styles and assets
import colors from "../config/colors";
import styled from "styled-components";
import * as Typography from "../config/Typography";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { withTheme } from "styled-components";
import color from "../config/color";

const { width, height } = Dimensions.get("window");

const SearchResultsCard = ({ 
  images, 
  title, 
  subtitle, 
  rating, 
  reviews, 
  onPress 
}) => {
  return (
    <View style={{
      width:"90%",
      // paddingRight:20,
      borderColor:"gray",
      }}>

    <TouchableWithoutFeedback 
      style={{
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 5,
        borderRadius:12,
        margin:10,
        marginLeft:20,
        marginRight:20,
        borderColor:"gray",
        
      }}
      onPress={onPress}>
      <View style={styles.details}>
        <Rating rating={rating} reviews={reviews} />
        <View style={styles.title}>
          <Typography.H4 colors={colors.black}>{title}</Typography.H4>
        </View>
        {/* Price */}
        <Typography.PBold color={color.black}>{`$${subtitle}`}</Typography.PBold>
      </View>

    </TouchableWithoutFeedback>
    </View>

  // {/* </Rounded> */}

  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor:"white",
    borderRadius:12,
    borderColor:"gray",
    // marginRight:90,
    paddingRight:200,
    

  },
  images: {
    width: width,
    height: height / 3,
  },

  details: {
    // marginTop: 10,
    // marginBottom: 20,
    padding:20,
    backgroundColor: 'white',
    height:150,
    borderColor:"gray",
    borderRadius:12,

  },

  title: {
    marginVertical: 3,
  },
});

const Rounded = styled.View`
  background-color: white;
`;
export default SearchResultsCard;
