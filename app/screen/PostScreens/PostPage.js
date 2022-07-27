
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Alert, ScrollView,  Dimensions , Switch, Keyboard, Platform} from 'react-native';

// import asset 
import color from '../../config/color';
import * as Typography from "../../config/Typography";

// import redux 
import { dispatchtags, post, postContent, postLink, postPrivacy, postTitle, tagModalState } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';

// import component 
import * as Button from "../../components/Blocks/Button"
import { TagModal } from '../../components/Blocks/Modals';
import Header from "../../components/Bars&Header/Header";

//library
import { getLinkPreview } from 'link-preview-js';


const { width, height } = Dimensions.get("window");


const PostPage = ({ navigation, route }) =>  {

  const postData = useSelector(state => state.post)
  const dispatch = useDispatch();
  const tags = useSelector(state => state.tags.tags)

  const [isPrivate, setIsPrivate] = useState(false);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState)

  useEffect(() => {
    dispatch(postPrivacy(isPrivate))
  }, [isPrivate])

  // get title

  const getTitle = () => {
    getLinkPreview(postData.post_link).then( r => {
      dispatch(postTitle(r.title))
      setIsGetLink(true)
    })
  }

  const [ isGetLink, setIsGetLink ] = useState(false)

  useEffect(() => {
    if (!isGetLink) getTitle()
  }, [postData.post_link])

  //Press Tags filter 
  const showTagModal = () => {
    dispatch(tagModalState(true));
  }


  const DeleteTag = (item) => {
    let dataToChange = [...tags];
    dataToChange = dataToChange.filter(remain => remain.id !== item.id)
    dispatch(dispatchtags(dataToChange))
  }

  const CancelPost = () => {
    setIsGetLink(false)
    dispatch(post("","",null,"",false))
    dispatch(dispatchtags([]))
    setIsPrivate(false)
    navigation.navigate("HomePage");
  }

  const Close = () => {
    Alert.alert("Discard the post?", "", [{text:"No"}, {text: "Yes", onPress : ()=> CancelPost()}])
  }

  const ToNextPage = () => {
    setIsGetLink(false)
    navigation.navigate("PostPage1")
  }

  // --------------------------dispathc tags 

  return (
    <View style={styles.container}>
       {/* modal  */}
      <TagModal TagBfrSlct={tags} route_name={route.name} />    

      <Header 
        icon="close" 
        RightButtomName="Next" 
        onPressLeft={() => Close()} 
        onPressRight={() => ToNextPage()}
      />
      <ScrollView onScrollBeginDrag={Keyboard.dismiss}> 
        <View style={{paddingHorizontal:20, marginBottom:20 }}>
          <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Title</Typography.H2></View>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:20, width:"100%",color:color.black}}
              placeholder="Title"
              placeholderTextColor={color.gray}
              value={useSelector(state => state.post.post_title)}
              onChangeText={(text) => dispatch(postTitle(text))}
            />
          </View>
        </View>

        <View style={{paddingHorizontal:20, marginBottom:20 }}>
          <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Link</Typography.H2></View>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:20, width:"100%",color:color.black}}
              value={useSelector(state => state.post.post_link)}
              placeholder="Link"
              placeholderTextColor={color.gray}
              onChangeText={(text) => dispatch(postLink(text))}
            />
          </View>
        </View>
        
        <View style={{paddingHorizontal:20, marginBottom:10 }}>
          <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Description (Optional)</Typography.H2></View>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:90, paddingTop:20, height:180, width:"100%",color:color.black }}
              placeholder="How the story inspires you?"
              multiline
              numberOfLines={4}
              placeholderTextColor={color.gray}
              value={useSelector(state => state.post.post_content)}
              onChangeText={(text) => dispatch(postContent(text))}
            />
          </View>
        </View>
        <View style={{paddingHorizontal:30, marginVertical:10 }}>
          <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-evenly"}}>
            <Typography.H4 color={color.black} >Set private?</Typography.H4>
            <View style={{width:"49%"}}/>
            <Switch  style={{marginLeft:"10%"}} onValueChange={toggleSwitch} value={postData.isPrivate}/>
          </View>
        </View>
        <View style={{paddingHorizontal:20, marginBottom:10, width:"40%",marginHorizontal:10, flexDirection:"row", alignItems:"center" }}>
            <Button.BtnTxtUnderline label = "Add tags" color= {color.gray} onPress = {() => showTagModal()} />
        </View>
          <View style={{ flexDirection:"row", flexWrap:"wrap", paddingHorizontal:15}}>
            {tags.map((item, i) => (
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
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop:30,
    // paddingTop: Constants.statusBarHeight,
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

export default PostPage;