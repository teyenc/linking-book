
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, FlatList, Image, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator, Pressable, RefreshControl, Alert, Keyboard, Switch} from 'react-native';

//import component
import * as Button from "../../components/Blocks/Button";
import { cloneDeep } from "lodash"; //
import * as Card from "../../components/Blocks/Card"
import { GET, getTimeDif, storeData ,getToken, storeToken, getData } from '../../helpers/functions';// save

//icon
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

// import style
import color from '../../config/color';
import * as Typography from "../../config/Typography";

// import data 
import { BACKEND } from '../../config/config';

// import redux 
import { useDispatch } from "react-redux";
import { ColtModal, refreshCollection } from '../../store/actions';
import { SaveModal } from '../../components/Blocks/Modals';

const { width, height } = Dimensions.get("window");

const ExploreListing = ({navigation, route}) => {

  //show modal
  const [ showtag, setShowtag] = useState(false);
  
  // heartOnPress part 
  const [ dataBfrSlct, setDataBfrSlct ] = useState([]);

  const dispatch = useDispatch();

  // load data 
  const [firstLoad, setFirstLoad] = useState(false)
  const [DataLoaded, setDataLoaded] = useState([])
  const [postCount, setPostCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0)
  const [pageloaded, setPageLoaded ] =useState(0) 

  // search filter 
  const [tagQueryed, setTagQueryed ] = useState(route.params.id)
  const [titleQueryed, setTitleQueryed] = useState(route.params.title)
  // console.log(titleQueryed)
  
  // svae posts 
  const [ savedPost, setSavedPost] = useState("");

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false)


  useEffect(() => {
    if (route.params !== undefined && route.params.name) {
      setDataBfrSlct(dataBfrSlct.concat(route.params))
    }
  }, [route.params])

  //Load firstdata -----------------------------------------------------
  // token  

  useEffect(() => {
    if (pageloaded === 0 ) {
      setFirstLoad(false)
      LoadFirstData();
    }
  }, [tagQueryed, pageloaded]);

  // apply querys 
  const LoadFirstData = () => {
    if ( pageloaded === 0) {
      if ( tagQueryed && !titleQueryed) { 
        query = "&tags=" + tagQueryed
        setPageLoaded(0);
        FetchPosts(query);  
      }
      else if (!tagQueryed && titleQueryed ) {
        query = "&title=" + titleQueryed
        setPageLoaded(0);
        FetchPosts(query);  
      }
      else if ( tagQueryed && titleQueryed) {
        query = "&title=" + titleQueryed + "&tags=" + tagQueryed
        setPageLoaded(0);
        FetchPosts(query);  
      }
      else {
        setPageLoaded(0);
        FetchPosts("");  
      }
    }
  }

  const FetchPosts = (query) => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/posts?page=" + 1 + query, {
        method:"GET",
        headers:{
          "Authorization" : "Bearer " + accessToken,
        },
      })
      .then(res => res.json())
      .then(res => {
        setFirstLoad(true)
        if (res.count) {
          setTotalPage(res.pagination.totalPages)
          setPostCount(res.count)
        }
        setDataLoaded([])
        setDataLoaded(res.posts)//
        setPageLoaded(1)
        storeData("exploreListingLoadingPage", "2") // means the next page will be loaded
        setFirstLoad(true)
        setRefreshing(false)
      })
    })
  }

  // load more data---------------------------------------
  const LoadMoreData = (query) => {
    getData("exploreListingLoadingPage").then(pg => {
      if (0 < (JSON.parse(pg)-1 ) < totalPage && pg ) {
        getToken("accessToken").then(accessToken => {
          fetch( BACKEND + "/posts?page=" + pg + query, GET())
          .then(res => res.json())
          .then(res => {
            if (res.posts) {
              const nextPg = JSON.stringify(JSON.parse(pg)+ 1)
              setDataLoaded(DataLoaded.concat(res.posts))
              storeData("exploreListingLoadingPage",nextPg ).then( r => {
                setIsLoading(false)
              })
              setRefreshing(false)
              setPageLoaded(JSON.parse(pg))
            }
            else setIsLoading(false)
          })
        })
      }
      else setIsLoading(false)
    })
  }
  
  //apply querys 
  useEffect(() => {
      if (tagQueryed && !titleQueryed) { 
        query = "&tags=" + tagQueryed
        LoadMoreData(query);  
      }
      else if (titleQueryed && !tagQueryed) {
        query = "&title=" + titleQueryed
        LoadMoreData(query);  
      }
      else if (tagQueryed && titleQueryed) {
        query = "&title=" + titleQueryed + "&tags=" + tagQueryed
        LoadMoreData(query);  
      }
      else {
        LoadMoreData("");  
      }
  }, [isLoading]);


  // save posts
  
  const heartOnPress = (item) => {
    getData("LocalCollections").then(col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    setSavedPost(item.id)
    dispatch(ColtModal(true))
  }

  // tag part
  const [ isSearchingTag, setIsSearchingTag] = useState(false)
  const [ NewSearch, setNewSearch ] = useState("")
  const [ tagsList, setTagList ] = useState([])
  const [ TagsInModal, setTagsInModal ] = useState([])

  useEffect(() => {
    if ( NewSearch){
      getToken("accessToken").then(accessToken => {
        setIsSearchingTag(true)
        fetch( BACKEND + "/tags?name=" + NewSearch.trim(), {
          method:"GET",
          headers:{
            "Authorization" : "Bearer " + accessToken,
          },
        })
        .then(res => res.json())
        .then(res => {
          setTagList(res.tags)
          setIsSearchingTag(false)
        })
      })
    }
    else setIsSearchingTag(false)
    
  }, [ NewSearch ] )

  const Input = (text) => {
    setIsSearchingTag(true)
    setNewSearch(text)
  }


  //Press Tags filter 
  const showTagModal = () => {
    setShowtag(true);
    setTagsInModal(dataBfrSlct)
  }

   // cancel tags
  const CancelTags = () => {
    setTagList([])
    setTagsInModal(cloneDeep(dataBfrSlct)); 
    setNewSearch("")
    setShowtag(false);
  }
  

  // select tag
  const ClickTag = (item) => {
    if ( TagsInModal.length >=5 ){
      Alert.alert("You can only add up to 5 tags!")
    }
    else {
      let data = [...TagsInModal ];
      data = data.filter(remain => remain.id == item.id)
      if (data.length == 0) {
        setTagsInModal(TagsInModal.concat(item))
      }
    }
  }

  const deleteTagInModal = (item) => {
    // console.log("A_A")
    let dataToChange = [...TagsInModal];
    dataToChange = dataToChange.filter(remain => remain.id !== item.id)
    setTagsInModal(dataToChange)
  }

  const confirmTags = () => {
    setIsLoading(false)
    setPageLoaded(0);
    setDataBfrSlct(cloneDeep(TagsInModal));
    let data = []
    for (let i = 0; i < TagsInModal.length ; i++) {
      data = data.concat(TagsInModal[i].id)
    }

    if (!data) {
      setTagQueryed("")
    }
    else {
      setTagQueryed(data)
    }
    setNewSearch("")
    setTagList([])
    setRefreshing(true)
    setFirstLoad(false)
    setShowtag(false);
  }


  return (
    <View style={styles.container}>
      <SaveModal postId={savedPost} /> 

      {/* tag modal  */}
      <Modal visible={showtag} transparent={true} animationType="fade">
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
                  style={{paddingLeft:10, width:"100%",color:color.black}}
                  placeholder="Search tags"
                  value={NewSearch}
                  placeholderTextColor={color.gray}
                  onChangeText={(text) => Input(text)}
                />
              </View>
              {/* <View> */}
              <View style={{ padding:10, width:"100%",}}>
                <View style={{ flexDirection:"row", flexWrap:"wrap", margin:10}}>
                  {TagsInModal.map((item, i) => (
                      <TouchableOpacity style= {{marginHorizontal: 2, marginTop:5 }} onPress = {()=> deleteTagInModal(item)} > 
                        <Button.BtnTagInModal
                          label = {`#`+item.name}
                          backgroundColor={color.darkBrown}
                          color={color.darkBrown}
                          labelcolor="white"
                        />
                      </TouchableOpacity>
                    ))
                  }  
                </View>

                {isSearchingTag  ? 
                  <ActivityIndicator size="large" color={color.darkBrown} /> 
                : 
                  null
                }
                {TagsInModal.length !== 0 ? <View style= {styles.Hline} /> :null }
                <ScrollView 
                  onScrollBeginDrag={Keyboard.dismiss} 
                  style={{marginBottom:10}} 
                >
                  {tagsList.map((item, i) => (
                      <View style={{width:width}}>
                        <TouchableOpacity style={styles.option} onPress={() => {ClickTag(item)}}>
                          <Text style={styles.text}>{`# ` + item.name}</Text>
                          <View style={{width:width - 270}}></View>
                        </TouchableOpacity>
                        <View style={styles.Hline}></View>
                      </View>
                    ))
                  } 
                  <View style={{height:30}}/>
                </ScrollView>
              </View> 
            </View>
          </View>
      </Modal>
    
      

      {/* header  */}
      <View style={{height:60, width:width, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
        <TouchableOpacity onPress= {() => navigation.goBack()}><EvilIcons color={color.black}  name="chevron-left" size={40}/></TouchableOpacity>
        {/* searchbar  */}
        <View style={styles.search}>
          <EvilIcons name="search" size={25} color={color.black} />
          <TextInput
            style={{paddingLeft:10, width:"100%",color:color.black}}
            placeholder="Search posts"
            value={titleQueryed}
            onSubmitEditing={() =>  setPageLoaded(0)}
            placeholderTextColor={color.gray}
            onChangeText={(text) => setTitleQueryed(text)}
          />
        </View>
        <TouchableOpacity onPress={()=> {showTagModal()}}>
          <Ionicons name="filter" size={25} color={color.black} style={{marginRight:10}}/>
        </TouchableOpacity>
      </View>


      {/* body */}

      { (!DataLoaded && firstLoad ==true )?
        <View style={{justifyContent:"center", height:"100%"}}>
          <Typography.H1 color={color.black} >No post here!</Typography.H1>
          <View style={{width:"100%", alignItems:"center", alignSelf:"center", paddingTop:20}}>
            <Button.BtnContain color={color.darkBrown} label="Add Posts!!" onPress= {() => navigation.navigate("Post")}/>
          </View>
        </View>
          :
        null
      }
      { firstLoad ? 
        <FlatList
          style={{width:"100%"}}
          data={DataLoaded}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Card.NormalCards
              nextRoute={"ExplorePostDetail"}
              item={item} 
              heartOnPress={() => heartOnPress(item)} 
              onPress={()=> navigation.push( "ExplorePostDetail", item)} 
              onPressPoster={() => navigation.push("ExploreUserProfile", {userId: item.userId})}
            />
          )}
          onEndReachedThreshold={0.4}
          onEndReached={()=> setIsLoading(true)}
          onScrollBeginDrag={Keyboard.dismiss}
          ListFooterComponent = {
            <View>
              { (isLoading == true && pageloaded < totalPage) ? <ActivityIndicator size="large" color={color.darkBrown} /> : null}
            </View>
          } 
          ListHeaderComponent = {
            <Pressable onPress={()=> {showTagModal()}} style={{ flexDirection:"row", flexWrap:"wrap", paddingHorizontal:10, width:"100%", alignItems:"center", justifyContent:"center"}}>
              {
                dataBfrSlct.map((item, i) => (
                  <View style= {{marginHorizontal: 2, marginTop:5 }}> 
                    <Button.BtnTagInCard
                      label = {item.name}
                      backgroundColor={color.darkBrown}
                      color={color.darkBrown}
                      labelcolor="white"
                    />
                  </View>
                ))
              }
            </Pressable>
          } 
        />
        :
        <ActivityIndicator size="large" color={color.darkBrown} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'center',
    // justifyContent: 'center',
  },
  search:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    // marginHorizontal:10,
    // borderWidth:1,
    width:"70%",
    backgroundColor:color.faintgray,
    // marginTop:30,
  },
  // heartOnPress style
  searchTag:{
    flexDirection:"row", 
    alignItems:"center", 
    alignSelf:"center",
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    // marginHorizontal:10,
    // borderWidth:1,
    width:"90%",
    backgroundColor:color.faintgray,
    // marginTop:30,
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
    justifyContent:"center",
    color:color.black
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
  settingOption:{
    width:"100%", 
    height: 90, 
    alignItems:"center", 
    justifyContent:"center"
  },

  //collection 
  collectionModalcontainer: {
    // marginTop:50,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    // paddingTop:20,
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 600,
    
    // marginTop:200,
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
    // justifyContent:"space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  flashText:{
    // width:"90%", 
    fontSize:20, 
    padding:15, 
    color:"white",
    backgroundColor:color.darkBrown, 
    marginBottom:20, 
    position:'absolute', 
    // // top:Constants.statusBarHeight, 
    // top:0,
    alignSelf:"center",
    justifyContent:"center",
    overflow:"hidden",
    borderRadius:20
  },
  option:{
    flexDirection:"row",
    width:"100%", 
    height:60, 
    // backgroundColor:"green"
  },
  modalOption:{
    width:"100%", 
    height: 90, 
    alignItems:"center", 
    justifyContent:"center"
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    marginVertical:10,
    width:"100%",
    backgroundColor:color.faintgray,
  },
});


export default ExploreListing;

