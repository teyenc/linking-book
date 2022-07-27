import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback, Text, View } from "react-native";

//icon
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import styled from "styled-components";
import color from "../../config/color";
import * as Typogrpahy from "../../config/Typography";

export const BtnContain = ({ color, disabled, label, onPress, icon, size }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Filled style={color && { backgroundColor: color }}>
          {size === "small" ? (
            <Wrapper>
              {icon && (
                <FontAwesome
                  name={icon}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <Typogrpahy.pS color="white" bold={true}>
                {label}
              </Typogrpahy.pS>
            </Wrapper>
          ) : (
            <Wrapper>
              {icon && (
                <FontAwesome
                  name={icon}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <Typogrpahy.Sub1 color="white" bold={true}>
                {label}
              </Typogrpahy.Sub1>
            </Wrapper>
          )}
        </Filled>
      </TouchableOpacity>
    </Container>
  );
};

export const BtnContain2 = ({ color, disabled, label, onPress, icon, size }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Filled style={color && { backgroundColor: color }}>
          {size === "small" ? (
            <Wrapper>
              {icon && (
                <FontAwesome
                  name={icon}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <Typogrpahy.P color="white" bold={true}>
                {/* {label} */}
                yaya
              </Typogrpahy.P>
            </Wrapper>
          ) : (
            <Wrapper>
              {icon && (
                <FontAwesome
                  name={icon}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <Typogrpahy.Sub1 color="white" bold={true}>
                {label}
              </Typogrpahy.Sub1>
            </Wrapper>
          )}
        </Filled>
      </TouchableOpacity>
    </Container>
  );
};

export const FilterBtn = ({ color, disabled, label, onPress, icon, size }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View 
        style={{ 
          // borderColor:color.lightgray,
          // borderWidth:1,
          justifyContent:"center",
          alignitems:"center",
          borderRadius:20,
          padding:10,

          
          // backgroundColor:color.faintgray,
          
        //  color && { backgroundColor: "white" }
        }}>
          {size === "small" ? (
            <Wrapper>
              {icon && (
                <Ionicons
                  name={icon}
                  color={color.green}
                  style={{ marginRight: 8 }}
                />
              )}
              <Typogrpahy.pS color="black" bold={true}>
                {label}
              </Typogrpahy.pS>
            </Wrapper>
          ) : (
            <Wrapper>
              {icon && (
                <Ionicons
                  name={icon}
                  // color={color.green}
                  color="black"
                  size={16}
                  style={{ marginRight: 8 }}
                />
              )}
              <Typogrpahy.Sub1 color="black" bold={false}>
                {label}
              </Typogrpahy.Sub1>
            </Wrapper>
          )}
        </View>
      </TouchableOpacity>
    </Container>
  );
};

export const BtnOutline = ({ color, disabled, label, labelcolor, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Outlined style={{ borderWidth: 2, borderColor: color }}>
          <Label style={{ color: labelcolor }}>{label}</Label>
        </Outlined>
      </TouchableOpacity>
    </Container>
  );
};

export const BtnTagLabel = ({ color, disabled, label, labelcolor, onPress , backgroundColor}) => {
  return (
    <View style={{width:"100%"}}>
      <TouchableOpacity onPress={onPress} disabled={disabled} >
        <OutlinedTag style={{ borderWidth: 1, borderColor: color, backgroundColor:backgroundColor}}>
          <LabelTag style={{ color: labelcolor }}>{label}</LabelTag>
        </OutlinedTag>
      </TouchableOpacity>
    </View>
  );
};

export const Btn = ({ color, disabled, label, fontSize, labelcolor, onPress ,borderRadius,  backgroundColor}) => {
  return (
    <View style={{width:"100%"}}>
      <TouchableOpacity onPress={onPress} disabled={disabled} >
        <View style={{ justifyContent:"center", alignItems:"center", borderRadius: borderRadius? borderRadius: 20, padding:8, borderWidth: 1, borderColor: color, backgroundColor:backgroundColor}}>
          <Text style={{ color: labelcolor, fontSize:  fontSize ? fontSize:13, }}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const BtnLine = ({ color, disabled, label, fontSize, labelcolor, onPress , backgroundColor}) => {
  return (
    <View style={{width:"100%"}}>
      <TouchableOpacity onPress={onPress} disabled={disabled} >
        <View style={{ justifyContent:"center", alignItems:"center", padding:8, borderColor: color, backgroundColor:backgroundColor}}>
          <Text style={{ textDecorationLine: "underline", color: labelcolor, fontSize:  fontSize ? fontSize:13, }}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


export const BtnTagLabelPost = ({ color, disabled, label, labelcolor, onPress , backgroundColor}) => {
  return (
    <View style={{width:"100%"}}>
      <TouchableOpacity onPress={onPress} disabled={disabled} >
        <View style={{ borderWidth: 1, borderColor: color, backgroundColor:backgroundColor, justifyContent:"center", alignitems:"center", borderRadius:20, padding:8, }}>
          <LabelTag style={{ color: labelcolor, marginHorizontal:10 }}>{label}</LabelTag>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const BtnTagInCard = ({ color, disabled, label, labelcolor, onPress , backgroundColor}) => {
  return (
    <View style={{width:"100%"}}>
      {/* <TouchableOpacity onPress={onPress} disabled={disabled} > */}
        <View style={{ borderWidth: 1, borderColor: color, backgroundColor:backgroundColor, justifyContent:"center", alignitems:"center", borderRadius:20, padding:8, }}>
          <LabelTag style={{ color: labelcolor, marginHorizontal:10 }}>{label}</LabelTag>
        </View>
      {/* </TouchableOpacity> */}
    </View>
  );
};

export const BtnTagInModal = ({ color, disabled, label, labelcolor, onPress , backgroundColor}) => {
  return (
    <View style={{width:"100%"}}>
      <View onPress={onPress} disabled={disabled} >
        <View style={{ borderWidth: 1, borderColor: color, backgroundColor:backgroundColor, 
          justifyContent:"center", 
          alignitems:"center", 
          alignContent:"center",  
          borderRadius:20, padding:8, flexDirection:"row" }}>
          <LabelTag style={{ color: labelcolor, marginHorizontal:5 }}>{label}</LabelTag>
          <Ionicons name="close-circle" size={15} color="white" />
        </View>
      </View>
    </View>
  );
};

export const BtnText = ({ color, label, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <LabelWrapper>
          <Label style={{ color }}>{label}</Label>
        </LabelWrapper>
      </TouchableOpacity>
    </Container>
  );
};

export const BtnTextTag = ({ color, label, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <LabelWrapper>
          <Label style={{ color }}>{label}</Label>
        </LabelWrapper>
      </TouchableOpacity>
    </Container>
  );
};

export const BtnTxtUnderline = ({ color, label, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <LabelWrapper>
          <Label
            style={{
              color: color,
              fontSize: 15,
              textDecorationLine: "underline",
            }}
          >
            {label}
          </Label>
        </LabelWrapper>
      </TouchableOpacity>
    </Container>
  );
};

export const BtnTagUnderline = ({ color, label, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <LabelWrapper>
          <Label
            style={{
              color: color,
              fontSize: 13,
              textDecorationLine: "underline",
            }}
          >
            {label}
          </Label>
        </LabelWrapper>
      </TouchableOpacity>
    </Container>
  );
};

export const FloatingButton = ({ iconName, label, onPress }) => {
  return (
    <Container>
      <TouchableWithoutFeedback onPress={onPress}>
        <FbWrapper elevation={3}>
          <FontAwesome name={iconName} color="white" />
          <Label style={{ color: "white", marginLeft: 6, fontSize: 13 }}>
            {label}
          </Label>
        </FbWrapper>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export const BtnCircle = ({ iconName, size, onPress }) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Circle>
          <EvilIcons name={iconName} size={size} color="black" />
        </Circle>
      </TouchableOpacity>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
`;

const Filled = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 14px;
  background-color: ${color.gray};
`;

// const FilledFilter = styled.View`
//   justify-content: center;
//   align-items: center;
//   border-radius: 24px;
//   padding: 10px;
// `;

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Outlined = styled.View`
  justify-content: center;
  align-items: center;

  border-radius: 20px;
  padding: 14px;
`;

const OutlinedTag = styled.View`
  justify-content: center;
  align-items: center;

  border-radius: 20px;
  padding: 8px;
`;



const LabelWrapper = styled.View`
  padding: 10px 0;
`;

const Circle = styled.View`
  background-color: white;
  border-radius: 500px;
  padding: 4px;
`;

const Filled2 = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${color.green};
  border-radius: 8px;
  padding: 14px;
`;

const FbWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${color.black};
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.12);
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const LabelTag = styled.Text`
  font-size: 13px;
  font-weight: bold;
`;
