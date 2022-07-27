import React, { useEffect, useState } from "react";
import {Dimensions, ScrollView, StyleSheet, View, Modal, Platform, Alert} from "react-native";

// assets and config
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";
import { BACKEND } from '../../config/config';

// component 
import * as List from "../../components/Blocks/List";
import Header from "../../components/Bars&Header/Header";

// library 
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

// redux && helpers
import { useDispatch, useSelector } from "react-redux";
import { psnlInfo } from "../../store/actions";
import { getNew, getRefreshToken, getToken, storeToken, UpdatePost } from "../../helpers/functions";



const { width, height } = Dimensions.get("window");

// console.log(user)

const PersonalInfo = ({ navigation, route }) => {

  const data = useSelector(state => state);
  // const TokenData = useSelector(state => state.token)
  const [ isLoading, setIsLoading ] = useState(false)
  const UserData = useSelector(state => state.auth)
  const dispatch = useDispatch()



  // Gender Picker
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [gender, setGender] = useState("");
  const [showGender, setShowGender] = useState(false);
  const showSetGender =() => {
    (showGender == true) ? setShowGender(false) : setShowGender (true)
  }

  useEffect(() => {
    if (UserData.gender === "N") setGender("Other") 
    else if (UserData.gender  === "M") setGender("Male") 
    else if (UserData.gender  === "F") setGender("Female") 
  }, [ UserData.gender ])

  // date picker 
  const [ date, setDate ] = useState(new Date());
  const [ showDate, setShowDate ] = useState(false);
  const [ datePresented, setDatePresented ] = useState(UserData.birthDate)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
    setDatePresented( currentDate.getFullYear() + "-" + (currentDate.getMonth() +1) + "-" + currentDate.getDate() )
  };


  const showSetTime =() => {
    (showDate == true) ? setShowDate(false) : setShowDate (true)
  }

  const [ genderData, setGenderData ] = useState(UserData.gender)

  const PickGender = (itemValue) => {
    // console.log(itemValue)
    setSelectedLanguage(itemValue)
    setGender(itemValue)
    if (itemValue === "Other") setGenderData("N") 
    else if (itemValue === "Male") setGenderData("M") 
    else if (itemValue === "Female") setGenderData("F") 
  }

  // picker gender -------------------------------------

  const GenderPicker = (style) => {
    return(
      <View>

        { Platform.OS === "ios" ?
          <Picker
            style={style}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              PickGender(itemValue)
            }>
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            {/* <Picker.Item label="Not Specified" value="not_pecified" /> */}
            <Picker.Item label="Other" value="Other" />
          </Picker>
        :
        <View style={{paddingLeft:10}}>

          <Picker
            style={{height:20, width:"100%", alignSelf:"center"}}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              PickGender(itemValue)
            }
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        }
      </View>
    )
  }

  //just a function --------------------------
  const setResult = (result) => {
    dispatch(psnlInfo(
      result.birthDate,
      result.gender,
    ))
  }

  // ----------------------------
  const save = () => {
    setIsLoading(true)
    let formdata = new FormData();
    formdata.append("birthDate", datePresented)
    if (genderData) {
      formdata.append("gender", genderData)
    }
    getToken("accessToken").then(accessToken => {
      // console.log(accessToken)
      fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost("accessToken", formdata))
      .then(res => { 
        // console.log(res.status)
        // res.json().then(r=> console.log(r))
        if (res.status === 200 || res.status === 201 ) {
          res.json().then( result  => {
            // console.log(result)
            setResult(result)
            setIsLoading(false)
            navigation.goBack()
          })
        }
        else if (res.status===403) {
          getToken("refreshToken").then(refreshToken => {
            fetch(BACKEND + '/user/refresh-token', getNew(refreshToken))
            .then(result => {
              // console.log(result.status)
              if (result.status === 200 || result.status === 201 ) {
                result.json().then(t => {
                  const new_accessToken = t.accessToken
                  // console.log(new_accessToken)
                  storeToken("accessToken", new_accessToken)
                  fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost(new_accessToken, formdata))
                  .then(r => {  
                    // console.log(r.status)
                    if (r.status === 200 || r.status === 201 ) {
                      r.json().then (r =>  {
                        console.log(r) 
                        setResult(r)
                      })
                      setIsLoading(false)
                      // navigation.navigate("UserProfile", {isUpdated: true}) 
                      navigation.goBack()
                    }
                  })
                })
              }
              else { 
                Alert.alert("Sorry. Please try again!")
                setIsLoading(false) 
              }
            })
          })
        }
        else { 
          Alert.alert("Sorry. Please try again!")
          setIsLoading(false)
        }
      })
    })
  }

  return (
    <Container>
      {/* main Page  */}
      {/* header */}
        <Header icon="chevron-left" onPressLeft={() => navigation.navigate("Accounts")} RightButtomName="Save" onPressRight={() => save()} isLoading={isLoading} />
      {/* page  */}
      <ScrollView style={{width:"100%", paddingRight:20, paddingLeft:20}} showsHorizontalScrollIndicator={false}>
        
          {/* lists */}
          <View style={{padding:18}}><Typography.H1 color={color.black} >Personal Info</Typography.H1></View>

          {/* email  */}
          <List.UserInfo type="Email" content={UserData.email} label="Edit"onPress={() => navigation.navigate("CheckEmail")} />
          
          {/* Birth date  */}
          <List.UserInfo type="Birth Date" content={datePresented} onPress={() => showSetTime()} />
            {showDate && (
              <View>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                  />
              </View>
            )}

          {/* Gender  */}
            { Platform.OS === "ios" ?  
              <View>
                <List.UserInfo type="Gender" content={gender} onPress={() => showSetGender()}/>
                { showGender && <GenderPicker/>}
              </View>
            :
              <View>
                <List.UserInfo2 type="Gender" />
                <GenderPicker/>
              </View>
            }
      </ScrollView>
    </Container>


  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export default PersonalInfo;
