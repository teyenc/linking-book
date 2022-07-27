
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, Dimensions , Switch, Keyboard} from 'react-native';
// import HomeStack from "./app/navigation/HomeStack";

// import asset 
import color from '../../config/color';
import * as Typography from "../../config/Typography";
import Header from "../../components/Bars&Header/Header";

// import redux 
import { useDispatch, useSelector } from 'react-redux';

// import data
import { BACKEND } from '../../config/config';

// import component 
import * as Button from "../../components/Blocks/Button"
import { fetchLinkPreview, getNew, getToken, storeToken, UpdatePost } from '../../helpers/functions';

//library
import { showMessage, hideMessage } from "react-native-flash-message";
import extractDomain from 'extract-domain';
import { TagModal } from '../../components/Blocks/Modals';
import { editPostTags, tagModalState } from '../../store/actions';

const { width, height } = Dimensions.get("window");


const EditPage = ({ navigation, route }) =>  {

  const Post = route.params.postData
  const UserData = useSelector(state => state.auth)

  // const [ tags, set]
  const [ isLoading, setIsLoading] = useState(false)
  const [ title, setTitle ] = useState(Post.title)
  const [ content, setContent ] = useState(Post.content)
  const [ link, setLink ] = useState(Post.link)
  const [ isPrivate, setIsPrivate ] = useState(Post.isPrivate);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState)

  // tag part----------------------------------------------

  const dispatch = useDispatch()

  useEffect(() => {
    if (Post.tags)dispatch(editPostTags(Post.tags))
  }, [])

  const NewTags = useSelector(state => state.tags.editPostTags)

  //Press Tags filter 
  const showTagModal = () => {
    dispatch(tagModalState(true));
  }

  const DeleteTag = (item) => {
    let dataToChange = [ ...NewTags ];
    dataToChange = dataToChange.filter(remain => remain.id !== item.id)
    dispatch(editPostTags(dataToChange))
  }


  // update -----------------------
  const clickUpdate = () => {
    setIsLoading(true)
    let domain ="";
    if (link) domain = extractDomain(link)
    if ( Post.title === title && Post.content === content &&  Post.link === link && Post.isPrivate !== isPrivate && Post.tags !== NewTags ) navigation.navigate("MyPosts")
    else if ( !title  ) Alert.alert("Title is required!")
    else if ( !link && !Post.imageLink ) Alert.alert("Link or Image is required!")
    else {
      if (link && domain !== "youtube.com") {
        fetchLinkPreview(link).then( r => {update(r)})
      }
      else update()
    }
  }

  const update = (imgPreviewLink) => {
    let formdata = new FormData();
    if ( Post.title !== title) { formdata.append("title", title)}
    if ( Post.content !== content) { formdata.append("content", content)}
    if ( Post.link !== link) { formdata.append("link", link)}
    formdata.append("isPrivate", isPrivate)
    if (imgPreviewLink) formdata.append("imgPreviewLink",imgPreviewLink)
    if ( NewTags.length > 0) {
      let tagIds = []
      for ( let i = 0; i < NewTags.length; i++) {
        tagIds.push(NewTags[i].id)
      }
      formdata.append("tags", JSON.stringify(tagIds))
    }
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/post/" + Post.id, UpdatePost(accessToken, formdata))
      .then(res => {  
        if ( res.status === 200 || res.status === 201 ) {
          setIsLoading(false)
          showMessage({message: "Updated!"})
          navigation.navigate("MyPosts", {isUpdated: true})
        }
        else if ( res.status === 403 ) {
          getToken("refreshToken").then(refreshToken => {
            fetch( BACKEND + '/user/refresh-token', getNew(refreshToken))
            .then( result => {
              setIsLoading(false)
              if ( result.status === 200 || result.status === 201 ) {
                result.json().then(t => {
                  const new_accessToken = t.accessToken
                  storeToken("accessToken", new_accessToken)
                  fetch( BACKEND + "/post/" + Post.id, UpdatePost(new_accessToken, formdata))
                  .then(r => {  
                    if ( r.status === 200 || r.status === 201 ) navigation.navigate("MyPosts", {isUpdated: true})
                  })
                })
              }
            })
          })
        }
        else { Alert.alert("Sorry. Please try again!") }
      })
    })
  }



  return (
    <View style={styles.container}>
       {/* modal  */}
      <TagModal TagBfrSlct={NewTags} route_name={route.name} />    
      <Header 
        icon="close" 
        RightButtomName="Update" 
        onPressLeft={() => navigation.goBack()} 
        onPressRight={() => clickUpdate()}
        isLoading={isLoading}
      />
      <ScrollView onScrollBeginDrag={Keyboard.dismiss}> 
        <View style={{paddingHorizontal:20, marginBottom:20 }}>
          <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Title</Typography.H2></View>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:20, width:"100%", color:color.black}}
              placeholder="Title"
              placeholderTextColor={color.gray}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </View>
        </View>

        <View style={{paddingHorizontal:20, marginBottom:20 }}>
          <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Link</Typography.H2></View>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:20, width:"100%",color:color.black}}
              value={link}
              placeholder="Link"
              placeholderTextColor={color.gray}
              onChangeText={(text) => setLink(text)}
            />
          </View>
        </View>
        <View style={{paddingHorizontal:20, marginBottom:10 }}>
          <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Description (Optional)</Typography.H2></View>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:90, paddingTop:20, height:180, width:"100%",color:color.black }}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={content}
              placeholderTextColor={color.gray}
              onChangeText={(text) => setContent(text)}
            />
          </View>
        </View>
        <View style={{paddingHorizontal:30, marginVertical:10 }}>
          <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-evenly"}}>
            <Typography.H4 color={color.black}>Set private?</Typography.H4>
            <View style={{width:"49%"}}/>
            <Switch  style={{marginLeft:"10%"}} onValueChange={toggleSwitch} value={isPrivate}/>
          </View>
        </View>
        <View style={{paddingHorizontal:20, marginBottom:10, width:"40%",marginHorizontal:10, flexDirection:"row", alignItems:"center" }}>
            <Button.BtnTxtUnderline label = "Add tags" color= {color.gray} onPress = {() => showTagModal()} />
        </View>
          <View style={{ flexDirection:"row", flexWrap:"wrap", paddingHorizontal:15}}>
            {NewTags.map((item, i) => (
              <View style= {{margin: 3, height : 45 }}> 
                  <Button.BtnTagLabelPost
                    label = {item.name}
                    backgroundColor={color.darkBrown}
                    color={color.darkBrown}
                    labelcolor="white"
                    onPress={() => DeleteTag(item)}
                  />
                </View>
              ))
            }
          </View>
        <View style={{height:300}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    width:"100%",
    backgroundColor:color.faintgray,
  },
  // heartOnPress style
  searchTag:{
    flexDirection:"row", 
    alignItems:"center", 
    alignSelf:"center",
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    width:"90%",
    backgroundColor:color.faintgray,
  },
  header:{
    flexDirection:"row",
    padding:20,
    // marginTop:10,
    width:"100%",
    justifyContent:"space-between"
  },
  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
  text:{
    marginLeft:20,
    fontSize:15,
    width:200,
    alignSelf:"center", 
    justifyContent:"center"
  },
  Modalcontainer: {
    // marginTop:50,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    // paddingTop:20,
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: height * 0.92,
    // marginTop:200,
  },
  option:{
    flexDirection:"row",
    width:"100%", 
    height:60, 
    // backgroundColor:"green"
  },
});

export default EditPage;