import React, { useState, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert, Pressable } from "react-native";

//import components
import { Description, Visit, } from "../../components/InPageCpnt/PostDetailCpnt";
import { MyPostsSetting, SaveModal } from "../../components/Blocks/Modals";
  
//import config and assets
import color from "../../config/color";
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";

// helpers &&  redux 
import { useDispatch } from "react-redux";
import { ColtModal, refreshCollection } from "../../store/actions";
import { getTimeDif, GET, getToken, getData, youtube_parser, openLink} from "../../helpers/functions";

//labrary
import { showMessage } from "react-native-flash-message";
import extractDomain from "extract-domain";
import YoutubePlayer from "react-native-youtube-iframe";
import * as Button from "../../components/Blocks/Button";
import FastImage from "react-native-fast-image";
import { useDltPost } from "../../helpers/ApiFunctions";

//icon
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";


const { width, height } = Dimensions.get("window");

const MyPostDetail = ({ route, navigation }) => {
  const PostData = route.params.postData
  const domain = extractDomain(PostData.link)
  const dispatch = useDispatch();

  const [ dltPost, setDltPost ] = useDltPost(PostData.id);

  useEffect(() => {
    if (dltPost.status) {
      if (dltPost.status == 200 || dltPost.status == 201 ) {
        showMessage({message: "Deleted!"})
        navigation.navigate("MyPosts", { isDeleted:true });
        dltPost.status = null
      }
      else Alert.alert("Some error happened!")
    }
  }, [dltPost])  

  // like
  const [ like_count, setLike_count] =useState(PostData.like_count)
  const [ isLike, setIsLike] =useState(false)

  // save 
  const [ showModal, setShowModal] = useState(false);
  const [ savedPost, setSavedPost] = useState("");

  // save Post-------------------------------
  const heartOnPress = (item) => {
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    setSavedPost(item.id)
    dispatch(ColtModal(true))
  }


  // Edit 
  const Edit = () => {
    setShowModal(false)
    navigation.navigate("EditPage", {postData: PostData})
  }

  // delete----------------------------------------------
  const DeletePost = () => {
    setShowModal(false)
    setDltPost()
  }

  const onDelete = () => {
    DeleteAlert();
  }

  // delete
  const DeleteAlert = () => {
    Alert.alert("Delete", "Do you want to delete the post?", [
      { text: "No", onPress: () => setShowModal(false)  },
      { text: "Yes", onPress: () => DeletePost()},
    ]);
  };

  // like --------------------------
  useEffect (() => {
    checkLike()
  }, [])

  const like = () => {
    setIsLike(true)
    setLike_count(like_count+1)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/like" , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          "postId": PostData.id
        })
      })
    })
  }


  const checkLike = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/like/check/" + PostData.id , GET(accessToken))
      .then( res => {
        if (res.status === 201 || res.status ===200 ) {
          res.json().then(result => {
            setIsLike(result.isLike)
            setLike_count(result.post.like_count)
          })
        }
      })
    })
  }


  const unlike = () => {
    setIsLike(false)
    setLike_count(like_count-1)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/like/unlike" , {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          "postId": PostData.id
        })
      })
    })
  }


  const pressLike = () => {
    if (isLike) unlike()
    else like() 
  }

  const [ imgPreview, setImgPreview] = useState("")
  useEffect(() => {
    setImgPreview(route.params.imgPreview)
  }, [])


  return (
    <View style={{flex:1, backgroundColor:color.faintgray}}>
      {/*  collection modal  */}

      <SaveModal postId={savedPost} />         
      <MyPostsSetting
        visible={showModal} 
        DeleteOnPress = {()=> onDelete()} 
        BackGroundOnPress = {() => setShowModal(false)} 
        CancelOnPress ={() => setShowModal(false)} 
        EditOnPress ={() => Edit()}
      />

      <ScrollView style={{ flex: 1}}>
        <View style={{backgroundColor:"white", paddingVertical:10}}>
          <View style={{flexDirection:"row"}}>

            <View style={{paddingLeft:10,marginVertical:10, flexDirection:"row", alignItems:"center", width:"80%"}}>
              { (!PostData.userAvatar) 
                ?
                <View style={{ backgroundColor:color.lightgray, height:40, width:40, borderRadius:width*0.1, justifyContent:"center", alignItems:"center"}} >
                  <AntDesign name="user" size={15} color="white" />
                </View>
                :
                // <Cache.Image style={{width:35, height:35, borderRadius:40}} uri={PostData.userAvatar } />
                <FastImage 
                  style={{width:35, height:35, borderRadius:40}} 
                  source={{ 
                    uri: PostData.userAvatar, 
                    priority: FastImage.priority.high
                  }}    
                />
              }
              <View style={{marginLeft:10}}></View>

              <Typography.Sub1  
                color={color.black} 
                style={{flex:1}}
              >
                {PostData.userName}
              </Typography.Sub1>
              <Text style={{color:color.gray, marginLeft:15, fontSize:13}}>{getTimeDif(PostData.createdAt)}</Text>
            </View>



            <View style={{flexDirection:"row-reverse", width:"20%"}}>
              <TouchableOpacity style={{justifyContent:"center", paddingHorizontal:20}} onPress={() => setShowModal(true)}>
                <Ionicons color={color.black}  size={20} name="ellipsis-vertical-outline"/>
              </TouchableOpacity>
            </View>
          </View>

          { (!PostData.imageLink) ? 
            [
              domain == "youtube.com" ?
              <YoutubePlayer 
                width={width}
                height={width*0.6}
                videoId={youtube_parser(PostData.link)}
              />
              :
              <Pressable onPress={() => openLink(PostData.link)}>
                {/* <Cache.Image style={{width:width, height:0.75* width}} uri = {imgPreview} /> */}
                <FastImage
                  style={{width:width, height:0.75* width}} 
                  source={{ uri: imgPreview, priority: FastImage.priority.high}}    
                />
                <View style={{backgroundColor:color.lightgray, height:30,flexDirection:"row",alignContent:"center", justifyContent:"center"}}>
                  <Text style={{alignSelf:"center", marginRight:10, color:color.black}}>{domain}</Text>
                  <Ionicons 
                    color={color.black}  
                    name="open-outline" 
                    size={20} 
                    style={{alignSelf:"center"}}
                  />
                </View>
              </Pressable>
            ]
            : 
            null
          }
          
          {(!PostData.imageLink) ? null : 
            <TouchableOpacity onPress={() => openLink(PostData.link)} style={{alignContent:"center",}} >
              {/* <Cache.Image style={{width:width, height: PostData.imageHeight/PostData.imageWidth * width }} uri={PostData.imageLink } />*/}
              <FastImage 
                style={{width:width, height: PostData.imageHeight/PostData.imageWidth * width }} 
                source={{ uri: PostData.imageLink, priority: FastImage.priority.high}}    
              />
            </TouchableOpacity>
          }

          {/* Button */}
          <View style={{padding:20, flexDirection:"row", justifyContent:"space-evenly"}}>
            <Visit link = {PostData.link}/>
            <View style={{width:"30%"}}>
              <Button.BtnContain label="Save" color={color.darkBrown} onPress={() => heartOnPress(PostData)}/>
            </View>
          </View>

          <View style={{paddingHorizontal:15}} >
            {/*  like_count */}
            {like_count != 0 ? 
              <Text style={{marginBottom:5, color:color.black}}>{like_count} likes</Text>
              :null
            }

            <View style={{flexDirection:"row", paddingVertical:0}}>
              <TouchableOpacity style={{}} onPress={() => pressLike() }>
                {
                  isLike ? 
                  <Ionicons name="heart" size={30} color={color.gray}/>:
                  <Ionicons name="heart-outline" size={30} color={color.gray}/>
                }
              </TouchableOpacity>
              <TouchableOpacity style={{paddingLeft:15}} onPress={() => navigation.push( "AccountComments", {postId: PostData.id, posterId : PostData.userId})}>
                <Ionicons name="chatbubble-outline" size={30} color={color.gray} ></Ionicons>
              </TouchableOpacity>
            </View>

            <View style={{paddingTop:10}}>
              <Text style={{fontSize:24, fontWeight:"400", color:color.black}}>{PostData.title}</Text>
            </View>
            <Description content={PostData.content} />

            {!PostData.tags ? null : 
              <View style={{ flexDirection:"row", flexWrap:"wrap", paddingTop:5}} >
                {PostData.tags.map((item, i) => (
                    <View style= {{marginHorizontal: 5, marginTop:5, }}> 
                      <Button.BtnTagUnderline
                        label =  {`# ` + item.name}
                        color={color.darkBrown}
                      />
                    </View>
                  ))
                }
              </View>
            }
          </View>  
        </View>
      </ScrollView>
    </View>
  );
};

export default MyPostDetail;
