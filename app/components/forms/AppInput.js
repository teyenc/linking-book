import React, { useState } from "react";
import { TouchableOpacity, Text, TextInput, View} from "react-native";
import { useFormikContext } from "formik";

//import components
import ErrorMessage from "./ErrorMessage";

//import styles and assets
import styled from "styled-components";
import color from "../../config/color";
import EvilIcons from "react-native-vector-icons/EvilIcons";

export const Default = ({ name, ...otherProps }) => { 
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <Container>
      <Inputfield 
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        placeholderTextColor={color.gray}
        {...otherProps}
      ></Inputfield>
      {<ErrorMessage error={errors[name]} visible={touched[name]} />}
    </Container>
  );
};


export const email = ({ name, placeholder, keyboardType, ...otherProps }) => { 
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <View style={{width:"100%"}}>
      <TextInput style={{padding:20, backgroundColor:color.faintgray, borderRadius:20, color:"black"}} 
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={color.gray}
        {...otherProps}
      ></TextInput>
      {<ErrorMessage error={errors[name]} visible={touched[name]} />}
    </View>
  );
};

export const name = ({ name, placeholder, keyboardType, ...otherProps }) => { 
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <View style={{width:"100%"}}>
      <TextInput style={{padding:20, backgroundColor:color.faintgray, borderRadius:20, color:"black"}} 
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={color.darkgray} 
        {...otherProps}
      ></TextInput>
      {<ErrorMessage error={errors[name]} visible={touched[name]} />}
    </View>
  );
};

export const Signup = ({ name, ...otherProps }) => {
  // const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <Container>
      <Inputfield 
        // onBlur={() => setFieldTouched(name)}
        // onChangeText={handleChange(name)}
        // {...otherProps}
      ></Inputfield>
      {/* {<ErrorMessage error={errors[name]} visible={touched[name]} />} */}
    </Container>
  );
};

export const AuthPw = ({ name, placeholder, ...otherProps }) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  const [hide, setHide] = useState(true);

  const TogglePw = () => {
    setHide((hide) => !hide);
  };

  return (
    <Container>
      <View style={{flexDirection:"row" ,justifyContent:"center", alignItems:"center", paddingHorizontal:20,paddingVertical:10, backgroundColor:color.faintgray, borderRadius:20,color:"black"}}>
        <Input
          secureTextEntry={hide}
          onBlur={() => setFieldTouched(name)}
          onChangeText={handleChange(name)}
          placeholder={placeholder}
          placeholderTextColor={color.gray}
          {...otherProps}
        ></Input>
        <TouchableOpacity onPress={TogglePw}>
          {hide === true ? <Text style={{color: "black"}}>Show</Text> : <Text style={{color: "black"}}>Hide</Text>}
        </TouchableOpacity>
      </View>
      {<ErrorMessage error={errors[name]} visible={touched[name]} />}
    </Container>
  );
};

export const Pw = ({ name, ...otherProps }) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  const [hide, setHide] = useState(true);

  const TogglePw = () => {
    setHide((hide) => !hide);
  };

  return (
    <Container>
      <InputLine>
        <Input
          secureTextEntry={hide}
          onBlur={() => setFieldTouched(name)}
          onChangeText={handleChange(name)}
          placeholderTextColor={color.gray}
          {...otherProps}
        ></Input>
        <TouchableOpacity onPress={TogglePw}>
          {hide === true ? <Text style={{color: "black"}}>Show</Text> : <Text style={{color: "black"}}>Hide</Text>}
        </TouchableOpacity>
      </InputLine>
      {<ErrorMessage error={errors[name]} visible={touched[name]} />}
    </Container>
  );
};

export const DefaultInput = ({ name, value, onChangeText, keyboardType, placeholder,...otherProps }) => {
  return (
    <Container>
      <Inputfield
        keyboardType={keyboardType}
        name={name}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        clearButtonMode="always"
        placeholderTextColor={color.gray}
        {...otherProps}
      ></Inputfield>
    </Container>
  );
};

export const PostInput = ({ name, value, onChangeText, ...otherProps }) => {
  return (
    <Container>
      <Inputfield
        name={name}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="always"
        placeholderTextColor={color.gray}
        {...otherProps}
      ></Inputfield>
    </Container>
  );
};

export const Search = ({ onSubmitEditing }) => {
  return (
    <SearchArea>
      <EvilIcons name="search" size={20} color={color.black} />
      <SearchInput autoFocus={true} onSubmitEditing={onSubmitEditing} />
    </SearchArea>
  );
};

const Container = styled.View`
  width: 100%;
`;

const Inputfield = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #d4d4d4;
  padding: 20px 0;
  /* height: 40px; */
`;

const InputLine = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${color.lightgray};
`;

const Input = styled.TextInput`
  width: 90%;
  height: 40px;
  color: black;
`;

const SearchArea = styled.View`
  flex-direction: row;
  align-items: center;
  width: 80%;
  border: 1px solid ${color.lightgray};
  border-radius: 25px;
  padding: 10px;
`;

const SearchInput = styled.TextInput`
  margin-left: 10px;
  width: 90%; 

`;
