import React, {useEffect, useState} from "react";
import { View, FlatList, Text, SectionList, StatusBar, Dimensions, Touchable, TouchableOpacity, Image, Alert } from "react-native";
import styled from "styled-components";
import color from "../../config/color";
import { Cap } from "../../config/Typography";
import { ScrollView } from "react-native-gesture-handler";
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";
import { CommonActions } from '@react-navigation/native';

// icon 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



export const SingleList = ({title, icon, onPress}) => {
    return(
      <View>
          <TouchableOpacity onPress={onPress} style={{ alignitems: "center", padding: 20, flexDirection: "row"}}>
            <TextContainer>
              <Typography.Sub1 color={color.black}>{title}</Typography.Sub1>
            </TextContainer>
              <MaterialCommunityIcons
                name={icon}
                size={24}
                style={{ color: color.gray }}
              />
          </TouchableOpacity>
          <View style={{paddingHorizontal:20}}>
            <HLine/>
          </View>
        </View>
    )
}



const TextContainer = styled.View`
    flex: 1;
    flex-direction: column;
`;

const HLine = styled.View`
    width: 100%;
    margin: 0 auto;
    height: 1px;
    background-color: ${color.lightgray};
`;