import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";

//imnport component 
import * as Button from "../Button";
import ImgSlider from "../ImgSlider";

//import styles and assets
import styled from "styled-components";
import colors from "../config/colors";
import { H4, SP } from "../../config/Typography";

//icon
import EvilIcons from "react-native-vector-icons/EvilIcons";


//import data
import {PriceOptions} from "../data/tagOptions";
import color from "../../config/color";

const { width, height } = Dimensions.get("window");

const PriceFilter = (showprice) => {
  return (
    <View>
        { Platform.OS === "ios" ?
          <Modal visible={showprice} transparent={true} >
            <View style={{flex:1, backgroundColor: "#000000AA"}} ></View>
            <Modal visible={showprice} transparent={true} animationType="slide">

              <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}> 

                <View style={styles.priceFilter} >
                  <View style={styles.header}>
                    <TouchableOpacity onPress={() => setShowprice(false)}>
                      <EvilIcons color={color.black}  name="close" size={30}></EvilIcons>
                    </TouchableOpacity>
                  </View>
                  {PriceOptions.map((item, i) => (
                    <View style={{margin:10, width:150}}>
                      <Button.BtnContain
                      label={item.name}
                      color={colors.green}
                      onPress={() => {priceFilterDone(i)}}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </Modal>
          </Modal>
          
        :
          <View>
            <Modal visible={showprice} transparent={true} animationType="fade">
              <View style={{flex:1, backgroundColor: "#000000AA"}} />
            </Modal>
            <Modal visible={showprice} transparent={true} animationType="slide">

              <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}> 

                <View style={styles.priceFilter} >
                  <View style={styles.header}>
                    <TouchableOpacity onPress={() => setShowprice(false)}>
                      <EvilIcons color={color.black}  name="close" size={30}></EvilIcons>
                    </TouchableOpacity>
                  </View>
                  {PriceOptions.map((item, i) => (
                    <View style={{margin:10, width:150}}>
                      <Button.BtnContain
                      label={item.name}
                      color={colors.green}
                      onPress={() => {priceFilterDone(i)}}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </Modal>
          </View>
        }
        </View>
        
  );
};

const styles = StyleSheet.create({
  picture: {
    width,
    height: 200,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default PriceFilter;
