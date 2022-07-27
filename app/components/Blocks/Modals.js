import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Modal, Pressable, ActivityIndicator, Switch, TextInput, Alert, FlatList, Text, TouchableOpacity, ScrollView, Keyboard, Dimensions} from 'react-native';

//asset & config
import * as Typography from "../../config/Typography";
import color from '../../config/color';
import { Common, ModalStyle } from '../../styles';
import { BACKEND } from '../../config/config';

//component 
import * as Card from "../Blocks/Card"
import Header from '../Bars&Header/Header';
import * as Button from "../Blocks/Button"

//helpers
import { GET, getData, storeData } from '../../helpers/functions';
import { useSaveNew, useSavePost } from '../../helpers/ApiFunctions';

//redux
import { dispatchtags, ColtModal, refreshCollection, tagModalState, exploreTags, editPostTags } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';

//library
import { showMessage } from "react-native-flash-message";
import { cloneDeep } from "lodash"; 
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const { width, height } = Dimensions.get("window");

export const SaveModal = ({ postId }) => { 

  const dispatch = useDispatch()
  const ModalState = (useSelector(state => state.Modal.ModalState))
  const LocalCollection = useSelector(state=> state.collections.collection)
  const [ collectionName, setCollectionName ] = useState("");
  const [ isAddNew, setIsAddNew ] = useState(false)
  const [ isPrivate, setIsPrivate ] = useState(false);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState)

  const [ save, setSave ] = useSavePost()
  const [ saveNew, setSaveNew ] = useSaveNew()

  // flash message 
  useEffect(() => {
    if (save.status) {
      if (save.status === 200 || save.status ===201) showMessage({message: "Saved!"})
      else if (save.errMsg == "{\"msg\":\"duplicated collection name and post\"}" ) showMessage({message: "Saved!"})
      else showMessage({message: "Error"})
      dispatch(ColtModal(false))
      save.status = null
    }
    if (saveNew.status) {
      if (saveNew.status === 200 || saveNew.status ===201) {
        storeData("LocalCollections", JSON.stringify(saveNew.response.collections))
        dispatch(refreshCollection(saveNew.response.collections))
        setCollectionName("")
        showMessage({message: "Saved!"})
        setIsAddNew(false)
        saveNew.status = null
        dispatch(ColtModal(false))
        setIsPrivate(false)
      } 
      else if ( saveNew.status === 400 && saveNew.errMsg == "{\"msg\":\"You can only have 50 collections!\"}"){
        Alert.alert ("You can have only 50 collections!")
        saveNew.status = null
        setIsPrivate(false)
      }
      else {
        Alert.alert ("Sorry. Some error happened!")
        saveNew.status = null
        setIsPrivate(false)
      }
    }
  }, [save, saveNew]) 

  const Cancel = () => {
    dispatch(ColtModal(false))
    setCollectionName("")
    setIsAddNew(false)
  }

  const Finish = () => {
    getData("LocalCollections").then( col => {
        if (JSON.parse(col).length >= 50 ) Alert.alert ("You can have only 50 collections!")
        else {
          if (!collectionName)Alert.alert("Please enter a collection name!!")
          else if ( collectionName.length > 30  ) Alert.alert("Please limited in 30 characters!")
          else setSaveNew(collectionName, postId, isPrivate)
        }
    })
  }  
  return (
    <Modal visible={ModalState} transparent={true} >
      <Pressable style={ModalStyle.ColtMdlCtnr} onPress={() => Cancel()} />
      { isAddNew ?
        <View style={ModalStyle.ColtMdlCtnr1}>
          <View style={ModalStyle.ColtMdlCtnr2}>
            <Header icon="close" RightButtomName="Done" onPressLeft={() => Cancel()} onPressRight={() => Finish()}/>
            <View style={{paddingHorizontal:20, marginBottom:20 }}>
              <View style={{marginHorizontal:10}}>
                <Typography.H2 color={color.black}>Add Collection Name</Typography.H2>
              </View>
              <View style={ModalStyle.newColtForm}>
                <TextInput
                  style={ModalStyle.coltTxtBox}
                  placeholder="Collection Name"
                  multiline
                  numberOfLines={4}
                  value={collectionName}
                  placeholderTextColor={color.gray}
                  onChangeText={(text) => setCollectionName(text)}
                />
              </View>
              <Text style ={{paddingLeft:10, color:color.gray}} >{collectionName.length + ` /30`}</Text>
              <View style={ModalStyle.ColtRowAdd}>
                <Typography.H4 color={color.black}>Set private?</Typography.H4>
                <Switch  style={{marginLeft:"70%"}} onValueChange={toggleSwitch} value={isPrivate}/>
              </View>
            </View>
          </View>
        </View>
        :
      
        <View style={{ justifyContent:"flex-end", flex:1, backgroundColor:"#000000AA"}}>
          <View style={ModalStyle.ColtMdlCtnr3}>
            <FlatList
              data={LocalCollection}
              keyExtractor={(item, index) => index}
              horizontal={false}
              numColumns={1}
              renderItem={({item }) => {
                return <Card.collectionList onPress={() => setSave(postId,item.id)} item={item}/>
              }}
            />
            <View style={Common.Hline}/>
            <Pressable style={ModalStyle.ColtOption} onPress={()=> setIsAddNew(true)}>
              <Typography.H2 color = {color.darkBrown}>Save to New Collection</Typography.H2>
            </Pressable>
            <View style={Common.Hline}/>
            <Pressable style={ModalStyle.ColtOption} onPress={()=> dispatch(ColtModal(false))}>
              <Typography.H2 color={color.black}>Cancel</Typography.H2>
            </Pressable>
          </View>
        </View>
      }  
    </Modal>
  )
}

export const TagModal = ({ TagBfrSlct, route_name }) => {

  let tags;
  if (route_name == "PostPage") tags = useSelector(state => state.tags.tags)
  if (route_name == "ExploreListing") tags = useSelector(state => state.tags.exploreTags)
  if (route_name.includes("Edit")) tags = useSelector(state => state.tags.editPostTags)

  // if (!tags) tags = []
  const dispatch = useDispatch();
  const TagModalState = (useSelector(state => state.Modal.TagModalState))
  const [ isSearchingTag, setIsSearchingTag] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ tagsList, setTagList ] = useState([])
  const [ TagsInModal, setTagsInModal ] = useState(TagBfrSlct)

  //search 
  const Input = (text) => {
    setIsSearchingTag(true)
    setSearch(text)
  }

  // select tag
  const ClickTag = (item) => {
    if ( TagsInModal.length >=5 )Alert.alert("You can only add up to 5 tags!")
    else {
      let data = [...TagsInModal ]; 
      data = data.filter(remain => remain.id == item.id)
      console.log(data.length)
      if (data.length == 0) { 
        setTagsInModal(TagsInModal.concat(item))
      }
    }
  }

  // console.log(TagsInModal)

  useEffect(() => {
    if (search){
      setIsSearchingTag(true)
      fetch( BACKEND + "/tags?name=" + search, GET())
      .then(res => res.json())
      .then(res => {
        setTagList(res.tags)
      })
    }
    setIsSearchingTag(false)
  }, [ search ] )

  // cancel
  const CancelTags = () => {
    setTagList([])
    setTagsInModal(cloneDeep(tags)); 
    setSearch("")
    dispatch(tagModalState(false));
  }

  //delete tag
  const deleteTagInModal = (item) => {
    let dataToChange = [...TagsInModal];
    dataToChange = dataToChange.filter(remain => remain.id !== item.id)
    setTagsInModal(dataToChange)
  }

  //
  const confirmTags = () => {
    console.log(route_name)
    if (route_name =="PostPage") dispatch(dispatchtags(TagsInModal))
    if (route_name =="ExploreListing") dispatch(exploreTags(TagsInModal))
    if (route_name.includes("Edit")) dispatch(editPostTags(TagsInModal))
    setSearch("")
    setTagList([])
    dispatch(tagModalState(false));
  }

  useEffect(()=> {
    setTagsInModal(tags)
  },[ TagModalState ])


  return(
    <Modal visible={TagModalState} transparent={true} animationType="fade">
      <Pressable style={{flex:1, backgroundColor: "#000000AA"}} onPress={() => CancelTags()} />
        <View style={ Platform.OS == "ios" ? {justifyContent:"flex-end", flex:1, backgroundColor:"#000000AA"}:{ backgroundColor:"#000000AA", paddingTop:"10%"}}>
          <View style={{ borderTopRightRadius:30, borderTopLeftRadius:30,backgroundColor: '#fff', maxHeight: height*0.95 ,height:height*0.95,}}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => CancelTags()}>
                <EvilIcons color={color.black}  name="close" size={30}></EvilIcons>
              </TouchableOpacity>
              <TouchableOpacity style={{justifyContent:"center", marginRight:10 }} onPress={() => confirmTags()}>
                <Text style={{fontSize:17, textDecorationLine:"underline", color:color.black}}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Modalheader  */}
            <View style={styles.searchTag}>
              <EvilIcons name="search" size={25} color={color.black} />
              <TextInput
                style={{paddingLeft:10, width:"100%", color:color.black}}
                placeholder="Search tags"
                placeholderTextColor={color.gray}
                value={search}
                onChangeText={(text) => Input(text)}
              />
            </View>
            {/* <View> */}
            <View style={{ padding:10, width:"100%",}}>
              <View style={{ flexDirection:"row", flexWrap:"wrap", margin:10}}>
                { TagsInModal.map((item, i) => (
                    <TouchableOpacity style= {{marginHorizontal: 2, marginTop:5 }} onPress = {()=> deleteTagInModal(item)} > 
                      <Button.BtnTagInCard
                        label = {`#`+item.name}
                        backgroundColor={color.darkBrown}
                        color={color.darkBrown}
                        labelcolor="white"
                      />
                    </TouchableOpacity>
                  ))
                }  
              </View>

              { isSearchingTag  ? 
                <ActivityIndicator size="large" color={color.darkBrown} /> 
              : 
                null
              }
              { TagsInModal.length !== 0 ? <View style= {Common.Hline} /> :null }
              <ScrollView onScrollBeginDrag={Keyboard.dismiss} style={{marginBottom:10}}>
                {tagsList.map((item, i) => (
                    <View style={{width:width}}>
                      <TouchableOpacity style={{ flexDirection:"row",width:"100%", height:60, }} onPress={() => {ClickTag(item)}}>
                        <Text style={styles.text}>{`# ` + item.name}</Text>
                        <View style={{width:width - 270}}></View>
                      </TouchableOpacity>
                      <View style={Common.Hline}></View>
                    </View>
                  ))
                } 
                <View style={{height:30}}/>
              </ScrollView>
            </View> 
          </View>
        </View>
    </Modal>    
  )
}


export const ReportModal =({visible, onPressReport, onPressCancel}) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />

        <Pressable style={{ justifyContent:"flex-end", flex:1,backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            <Pressable style={styles.option} onPress={onPressReport}>
              <Typography.H2 color={color.black}>Report</Typography.H2>
            </Pressable>
            <View style={styles.Hline}/>

            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}

export const BlockModal =({visible, onPressReport, onPressBlock, onPressCancel, isBlocked}) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />
        <Pressable style={{ justifyContent:"flex-end", flex:1,backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            <Pressable style={styles.option} onPress={onPressBlock}>
              <Typography.H2 color={color.black}>{isBlocked ? "unblock" : "block"}</Typography.H2>
            </Pressable>
            <View style={styles.Hline}/>
            {/* <Pressable style={styles.option} onPress={onPressReport}>
              <Typography.H2 color={color.black}>Report</Typography.H2>
            </Pressable> */}
            <View style={styles.Hline}/>
            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}

export const EditAvatarModal =({visible, onPressRemove, onPressEdit, onPressCancel}) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />

        <Pressable style={{ justifyContent:"flex-end", flex:1,backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            <Pressable style={styles.option} onPress={onPressEdit}>
              <Typography.H2 color={color.black}>Change photo</Typography.H2>
            </Pressable>
            <View style={styles.Hline}/>
            <Pressable style={styles.option} onPress={onPressRemove}>
              <Typography.H2 color="red">Remove photo</Typography.H2>
            </Pressable>
            <View style={styles.Hline}/>
            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}

export const RemoveModal =({visible, onPressRemove, onPressCancel}) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />

        <Pressable style={{ justifyContent:"flex-end", backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            <Pressable style={styles.option} onPress={onPressRemove}>
              <Typography.H2 color={color.black}>Remove</Typography.H2>
            </Pressable>
            <View style={styles.Hline}/>

            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}

export const OneOptionModal =({ visible, ActionOne, onPressOne, onPressCancel }) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />

        <Pressable style={{ justifyContent:"flex-end", backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            <Pressable style={styles.option} onPress={onPressOne}>
              <Typography.H2 color={color.black}>{ActionOne}</Typography.H2>
            </Pressable>
            <View style={styles.Hline}/>

            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}

export const ActionModal =({visible, Action1, Action2, Action3, onPress1, onPress2,onPress3, onPressCancel}) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />
        <Pressable style={{ justifyContent:"flex-end", backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            { Action1 ?
              <View>
                <Pressable style={styles.option} onPress={onPress1}>
                  <Typography.H2 color={color.black}>{Action1}</Typography.H2>
                </Pressable>
                <View style={styles.Hline}/>
              </View>
              : null
            }
            { Action2 ?
              <View>
                <Pressable style={styles.option} onPress={onPress2}>
                  <Typography.H2 color={color.black}>{Action2}</Typography.H2>
                </Pressable>
                <View style={styles.Hline}/>
              </View>
              : null
            }
            { Action3 ?
              <View>
                <Pressable style={styles.option} onPress={onPress3}>
                  <Typography.H2 color={color.black}>{Action3}</Typography.H2>
                </Pressable>
                <View style={styles.Hline}/>
              </View>
              : null
            }

            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}

export const CancelModal =({visible, onPressRemove, onPressCancel}) => {
  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={onPressCancel} />

        <Pressable style={{ justifyContent:"flex-end", backgroundColor:"#000000AA"}} onPress={onPressCancel}>
          <View style={{  borderTopRightRadius:30, borderTopLeftRadius:30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
            <Pressable style={styles.option} onPress={onPressCancel}>
              <Typography.H2 color="red">Cancel</Typography.H2>
            </Pressable>
          </View>
        </Pressable>
    </Modal>
  )
}



export const MyPostsSetting = ( {visible, DeleteOnPress, BackGroundOnPress, CancelOnPress, EditOnPress}) => {
    return (
      <Modal visible={visible} transparent={true} animationType="fade">
        <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={BackGroundOnPress} />

          <Pressable style={{ justifyContent:"flex-end", flex:1,backgroundColor:"#000000AA"}} onPress={BackGroundOnPress}>
            <View style={styles.Modalcontainer}>
                <Pressable style={styles.option} onPress={EditOnPress}>
                    <Typography.H2 color={color.black}>Edit</Typography.H2>
                </Pressable>
                <View style={styles.Hline}/>
                <Pressable style={styles.option} onPress={DeleteOnPress}>
                    <Typography.H2 color={color.black}>Delete</Typography.H2>
                </Pressable>
                <View style={styles.Hline}/>

                <Pressable style={styles.option} onPress={CancelOnPress}>
                    <Typography.H2 color="red">Cancel</Typography.H2>
                </Pressable>
            </View>
          </Pressable>
      </Modal>
    )
}

export const LoadingModal = ({ visible }) => {
  return (
    // <View>
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={{width:"100%", height:"100%", backgroundColor: "#000000AA", justifyContent:"center", alignItems:"center"}} >
          <View style={{backgroundColor:"white", width:80, height:80, justifyContent:"center", alignItems:"center", borderRadius:20}}>
            <ActivityIndicator size="large" color={color.black}/>
          </View>
        </View>
      </Modal>
    // </View>
  )
}





const styles = StyleSheet.create({
    Hline :{
      width: "100%",
      margin: 0,
      height: 1,
      backgroundColor: "#e6e6e6",
    },
    Modalcontainer: {
      // marginTop:50,
      borderTopRightRadius:30,
      borderTopLeftRadius:30,
      // paddingTop:20,
    //   flex: 1,
      backgroundColor: '#fff',
      // backgroundColor: 'green',
      alignItems: 'center',
      justifyContent: 'center',
    //   maxHeight: 180,
      // marginTop:200,
    },
    option:{
      width:"100%", 
      height: 90, 
      alignItems:"center", 
      justifyContent:"center"
    },

    //tag
    header:{
      flexDirection:"row",
      padding:20,
      // marginTop:10,
      width:"100%",
      justifyContent:"space-between"
    },
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
    text:{
      marginLeft:20,
      fontSize:15,
      width:200,
      alignSelf:"center", 
      justifyContent:"center",
      color:color.black
    },
  
  });

