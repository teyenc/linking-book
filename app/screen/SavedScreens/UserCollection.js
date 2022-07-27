import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Dimensions, FlatList,Alert, RefreshControl, Modal, Pressable, ActivityIndicator} from 'react-native';

// config && asset
import color from '../../config/color';
import { BACKEND } from '../../config/config';

//  component 
import * as Button from "../../components/Blocks/Button";
import * as Typography from '../../config/Typography';

//library
import Ionicons from 'react-native-vector-icons/Ionicons';

// redux && helpers
import { useDispatch, useSelector } from 'react-redux';
import { SavePost, refreshCollection } from '../../store/actions';
import { getToken, storeData } from '../../helpers/functions';
import { useGetCollection } from '../../helpers/ApiFunctions';


const {width, height} = Dimensions.get("window")
 
const Collections = ({navigation, route}) =>  {

  const UserData = useSelector(state => state.auth)
  const [firstLoad, setFirstLoad] = useState(false)
  const LocalCollection = useSelector(state=> state.collections.collection)
  // const savePostStatus = useSelector(state => state.status)
  const dispatch = useDispatch();

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);

  // flash message 
  const [ flash ,setFlash ] = useState(false)
  const [ isDeleted, setIsDeleted ] = useState(false);
  const [ flashMessage, setFlashMessage ] = useState(null);

   //flash message -----------------------------
  // if (savePostStatus.status == 1) {
  //   setFlash(true);
  //   setTimeout(() => {
  //     setFlash(false)
  //   }, 1500);
  //   dispatch(SavePost(0))
  // }

  useEffect(() => {
    if (isDeleted == true ){
      setFlashMessage ("Deleted!")
      setFlash(true);
      setIsDeleted(false)
      setTimeout(() => {
        setFlash(false)
      }, 1500); 
    }
  }, [isDeleted])

  // scroll view scroll to top --------------------------
  const scrollRef = useRef(); 

  const toTop = () => {
    if (firstLoad && position !== 0 && LocalCollection.length) {
      scrollRef.current.scrollToIndex({index: 0});
    }
  };

  const [ position, setPosition ] = useState(0)
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setPosition(scrollPosition)
  };

  //collections----------------------------------------------------
  const [colt, setColt] = useGetCollection(UserData.id); 

  useEffect(() => {
    if (colt.status) {
      if (colt.status === 200 || colt.status === 201 ) {
        dispatch(refreshCollection(colt.response.collections))
        const coltStoring = JSON.stringify(colt.response.collections)
        storeData("LocalCollections",coltStoring )
        setFirstLoad(true)
        setRefreshing(false)
        colt.status = null
      }
      else {
        Alert.alert("Sorry. Some error happened!")
        setRefreshing(false)
        setFirstLoad(true)
      }
    }
  }, [colt])

  useEffect(() => {
    setColt()
  }, [ refreshing ])

  useEffect(() => {
    if (route.params !== undefined && route.params.status == 2) {
      setColt()
      setFlashMessage("Created!")
      setFlash(true);
      setTimeout(() => { setFlash(false)}, 1500);
    }
    if (route.params !== undefined && route.params.status == 3) { // delete
      setColt()
    }
  }, [ route.params ])


  const TextCollection  = ({ item }) => {
    return (
      <View style={{ justifyContent:"center", alignSelf:"center"}}>
        <TouchableOpacity style={styles.textCollection} onPress={() => navigation.push("SavedPostsInMyCollection" , {collectionId: item.id, userId: UserData.id})}>
          <View style={{width:"10%", marginHorizontal:20}}>
            <Ionicons name="book-outline" color={color.darkBrown} size ={25} />
          </View>
          <Text style={{fontSize:20, justifyContent:"center", alignSelf:"center", width:"65%", color:color.black}}>{item.name}</Text>
          <TouchableOpacity style={{paddingLeft:15, paddingBottom:5, width:"25%", height:"100%", justifyContent:"center"}} onPress={() => Select(item)}>
            <Ionicons color={color.black}  name="ellipsis-horizontal-outline" size={20}/>
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={{height:1, backgroundColor:color.lightgray, width:width}} />
      </View>
    )
  }

  // update 
  const Update = () => {
    setShowModal(false)
    navigation.navigate("UpdateCollectionName", { collection: Selected })
  } 

  // delete
  const DeleteAlert = () => {
    Alert.alert("Delete", "Do you want to delete the colletion?", [
      { text: "No" },
      { text: "Yes", onPress: () => DeleteCollection() },
    ]);
  };

  const DeleteCollection = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/collection/" + Selected.id , {
        method:"DELETE",
        headers:{
          "Authorization" : "Bearer " + accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => { 
        if (res.status === 200 || res.status === 201 ) {
          setRefreshing(true)
          setIsDeleted(true)
        }
        setShowModal(false)
      })
    })
  }

  const [ showModal, setShowModal] = useState(false);
  const [ Selected , setSelected ] = useState("")

  const Select = (item) => {
    setFlash(false)
    setShowModal(true)
    setSelected(item)
  }

  const OptionModal = () => {
    return (
      <Modal visible={showModal} transparent={true} animationType="fade">
        <Pressable style={{paddingTop:"30%", backgroundColor: "#000000AA", justifyContent:"flex-end", flex:1}} onPress={() => setShowModal(false)} />

          <Pressable style={{ justifyContent:"flex-end", flex:1,backgroundColor:"#000000AA"}} onPress={() => setShowModal(false)}>
            <View style={styles.Modalcontainer}>

              <Pressable style={styles.option} onPress={()=> DeleteAlert()}>
                <Typography.H2 color={color.black} >Delete</Typography.H2>
              </Pressable>
              <View style={styles.Hline}/>

              <Pressable style={styles.option} onPress={()=> Update()}>
                <Typography.H2 color={color.black} >Edit</Typography.H2>
              </Pressable>
              <View style={styles.Hline}/>

              <Pressable style={styles.option} onPress={()=> setShowModal(false)}>
                <Typography.H2 color="red">Cancel</Typography.H2>
              </Pressable>
            </View>
          </Pressable>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <OptionModal/>
      <View style={styles.Header}>
        <Pressable style={{justifyContent:"center", alignItems:"center", flex:1, paddingLeft:70}} onPress={() => toTop()} >
          <Text style={{alignSelf:"center", fontSize:18, color:color.black}}> Collections</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("SavedAddCollection")} style={{padding:15, width:70}}>
          <Ionicons color={color.black}  name = "add-outline" size={25} />
        </Pressable>
      </View>
      <View style={styles.Hline}/>
      
      { firstLoad ? 
        <FlatList
          ListHeaderComponent={
            <View>
              { ((!LocalCollection?.length) && firstLoad )?
                <View style={{justifyContent:"center", height:height*0.8}}>
                  <Typography.H1 color={color.black} >You don't have any collection!</Typography.H1>
                  <View style={{width:"100%", alignItems:"center", alignSelf:"center", paddingTop:20}}>
                    <Button.BtnContain color={color.darkBrown} label="Add a collection!!" onPress= {() => navigation.navigate("SavedAddCollection")}/>
                  </View>
                </View>
                  :
                null
              }
            </View>
          }
          data={LocalCollection}
          ref={scrollRef}
          onScroll={handleScroll}
          keyExtractor={(item, index) => index}
          horizontal={false}
          numColumns={1}
          renderItem={TextCollection}
          showsVerticalScrollIndicator={false}
          refreshControl = {
            <RefreshControl
              onRefresh={()=> setRefreshing(true)}
              refreshing={refreshing}
            />
          }
        />
        :
        <View style={{justifyContent:"center", height:"100%"}}>
          <ActivityIndicator size="large" color={color.darkBrown} />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // paddingTop:Constants.statusBarHeight,
    height:"100%"
  },
  collection:{
    width:width*0.4, 
    height: width*0.4, 
    marginVertical: 12, 
    marginLeft: '3%',
    marginRight: '3%', 
    borderRadius:12, 
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  textCollection:{
    flexDirection:"row",
    width:width,
    height: width*0.4*0.5, 
    marginVertical: 7, 
    borderRadius:12, 
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  Header:{
    flexDirection:"row",
    width:"100%",
  },
  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
  flashText:{
    fontSize:20, 
    padding:15, 
    color:"white",
    backgroundColor:color.darkBrown, 
    marginBottom:20, 
    position:'absolute', 
    // // top:Constants.statusBarHeight, 
    alignSelf:"center",
    justifyContent:"center",
    overflow:"hidden",
    borderRadius:20
  },

  Modalcontainer: {
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  option:{
    width:"100%", 
    height: 90, 
    alignItems:"center", 
    justifyContent:"center"
  },
});

export default Collections;
