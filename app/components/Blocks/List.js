import React from "react";
import { View, TouchableHighlight,TouchableOpacity, Text, Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import * as Button from "../Blocks/Button";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styled from "styled-components";
import * as Typography from "../../config/Typography";
import color from "../../config/color";
import FastImage from 'react-native-fast-image'



export const Default = ({ containedicon, icon, secondary, title, onPress }) => {
  return (
    <TouchableHighlight underlayColor={color.lightgray} onPress={onPress}>
      <Container>
        {containedicon && (
          <IconContainer>
            <MaterialIcons color={color.black} name={containedicon} size={18} />
          </IconContainer>
        )}
        <TextContainer>
          <Typography.Sub1 color={color.black}>{title}</Typography.Sub1>
          {secondary && <Typography.P color={color.black}>{secondary}</Typography.P>}
        </TextContainer>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            style={{ color: color.gray }}
          />
        )}
      </Container>
    </TouchableHighlight>
  );
};

export const UserList = ({
  image,
  meta,
  onPress,
  secondary,
  title,
  RightActions,
}) => {
  return (
      <Pressable underlayColor={color.faintgray} onPress={onPress}>
        <View style={{flexDirection:"row", width:"100%", alignItems:"center", paddingVertical:20}} >
            <View style={{ width:70, height:70, backgroundColor:color.faintgray, borderRadius:35, marginRight:30}}>
              { image  ? (
                // < Cache.Image style={{width:70, height: 70, borderRadius:35}} uri={ image } />
                <FastImage 
                  style={{width:70, height: 70, borderRadius:35}} 
                  source={{ uri: image, priority: FastImage.priority.high}}    
                />
                ) : 
                <AvatarEmpty>
                  <AntDesign name="user" size={26} color="white" />
                </AvatarEmpty>
              }
            </View>
            <View style ={{  width:"100%", flexWrap:"wrap", justifyContent:"center", }} >
              <FirstLine>
                <Typography.Sub1 color={color.black}>{title}</Typography.Sub1>
                <Typography.SP color={color.black}>{meta}</Typography.SP>
              </FirstLine>
              { secondary ? 
                <View style={{width:"70%", flexDirection:"row", flexWrap:"wrap"}} >
                  <Text style={{ flex: 1, flexShrink:1, color:color.gray, fontSize:13}} >{secondary}</Text>
                </View>
                :
                null
              }         
            </View>
        </View>
      </Pressable>
  );
};

export const UserList1 = ({
  image,
  meta,
  onPress,
  secondary,
  title,
  RightActions,
}) => {
  return (
      <Pressable underlayColor={color.faintgray} onPress={onPress}>
        <View style={{flexDirection:"row", width:"100%", alignItems:"center", paddingVertical:20}} >
            <View style={{ width:70, height:70, backgroundColor:color.faintgray, borderRadius:35, marginRight:20}}>
              { image ? (
                // < Cache.Image style={{width:70, height: 70, borderRadius:35}} uri={ image } />
                <FastImage 
                  style={{width:70, height: 70, borderRadius:35}} 
                  source={{ uri: image, priority: FastImage.priority.high}}    
                />
                ) 
                : 
                <AvatarEmpty>
                  <AntDesign name="user" size={26} color="white" />
                </AvatarEmpty> 
              }
            </View>
            <View style ={{  width:"100%", flexWrap:"wrap", justifyContent:"center", }} >
              <View style={{width:"62%"}}>
                <Typography.Sub1 color={color.black}>{title}</Typography.Sub1>
                {/* <Typography.SP color={color.black}>{meta}</Typography.SP> */}
              </View>
              { secondary  ? 
                <View style={{width:"55%", flexDirection:"row", flexWrap:"wrap"}} >
                  <Text style={{ flex: 1, flexShrink:1, color:color.gray, fontSize:13 }} >{secondary}</Text>
                </View>
                :
                null
              }         
            </View>
        </View>
      </Pressable>
  );
};

export const Comment = ({
  image,
  meta,
  onPress,
  secondary,
  title,
  RightActions,
}) => {
  return (
      <TouchableHighlight underlayColor={color.faintgray} onPress={onPress}>
        <View style={{flexDirection:"row", width:"100%", alignItems:"center", paddingVertical:20}} >
            <View style={{ width:70, height:70, backgroundColor:color.faintgray, borderRadius:35, marginRight:30}}>
              { image? (
                  // <Cache.Image style={{width:70, height: 70, borderRadius:35}} uri={ image } />
                <FastImage 
                  style={{width:70, height: 70, borderRadius:35}} 
                  source={{ uri: image, priority: FastImage.priority.high}}    
                />
              ) : 
                <AvatarEmpty>
                  <AntDesign name="user" size={26} color="white" />
                </AvatarEmpty>
              }
            </View>
            <View style ={{  width:"100%", flexWrap:"wrap", justifyContent:"center", }} >
              <FirstLine>
                <Typography.Sub1 color={color.black}>{title}</Typography.Sub1>
                <Typography.SP color={color.black}>{meta}</Typography.SP>
              </FirstLine>
              { secondary ? 
                null
                :
                <View style={{width:"55%", flexDirection:"row", flexWrap:"wrap"}} >
                  <Text style={{ flex: 1, flexShrink:1, color:color.gray, fontSize:13 }} >{secondary}</Text>
                </View>
              }         
            </View>
        </View>
      </TouchableHighlight>
  );
};

export const UserInfo = ( {type, content, label, onPress}) => {
  return (
    <View>
      <TouchableOpacity style={{padding:18, flexDirection:"row", justifyContent:"space-between"}} onPress={onPress}>
        <View>
          <Typography.H3 color={color.black}>{type}</Typography.H3>
          <View style={{padding:5}} />
          <Typography.P color={color.black}>{content}</Typography.P>
        </View>
        <View style={{ alignSelf:"center", padding:10}}>
          <Button.BtnTxtUnderline
            label={label}
            size="small"
            color={color.darkBrown}
            onPress={onPress}
          />  
        </View>
      </TouchableOpacity>
      <HLine/>
    </View>
  )
}

export const UserInfo2 = ( {type}) => {
  return (
    <View>
      <View style={{padding:18, flexDirection:"row", justifyContent:"space-between"}} >
          <Typography.H3 color={color.black}>{type}</Typography.H3>
      </View>
    </View>
  )
}

const Container = styled.View`
  background-color: white;
  flex-direction: row;
  align-items: center;
  padding: 20px 0;
`;

const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;

const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  background-color: ${color.faintgray};
  border-radius: 8px;
  border: 1px solid ${color.lightgray};
  margin-right: 15px;
`;

const HLine = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${color.lightgray};
`;

const Avatar = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  margin-right: 15px;
`;

const AvatarEmpty = styled.View`
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  margin-right: 15px;
  background-color: ${color.lightgray};
`;

const AvatarSmall = styled.Image`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  margin-right: 12px;
  background-color: ${color.lightgray};
`;

const AvatarSmallEmpty = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  border-radius: 23px;
  margin-right: 12px;
  background-color: ${color.lightgray};
`;

const AvatarXsmall = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  margin-right: 10px;
  background-color: ${color.lightgray};
`;

const AvatarXsmallEmpty = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  margin-right: 10px;
  background-color: ${color.lightgray};
`;

const FirstLine = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
