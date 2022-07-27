
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View , Dimensions, FlatList, TouchableOpacity, Pressable,TextInput, ActivityIndicator, Image} from 'react-native';

// library 
import styled from "styled-components";
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';

//icon
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";


// component 
import * as Cards from "../../components/Blocks/Cards"

// config 
import SearchCate from "../../data/SearchType";
import color from '../../config/color';

// redux && helpers 
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window");

export default function Explore({ route, navigation }) {

  const UserData = useSelector(state => state.auth)
  const [ Search, setSearch ] = useState("")

   //  category card
  const Category = ({ item }) => {
    // console.log(item)
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ExploreListing", item)}
        style={{ width: "44%", marginVertical: 12, marginLeft: '3%', marginRight: '3%',}}
      >
        <Cards.NewCategory
          onPress={() => navigation.navigate("ExploreListing", item)}
          image={item.image}
          title={item.name}
        />
      </TouchableOpacity>
    );
  };

  const categoryList = ({ item }) => {
    return (
      <Pressable 
        style={{paddingVertical:15, paddingHorizontal:25,borderTopWidth:1, borderColor: color.faintgray, width:width }}
        onPress={() => navigation.navigate("ExploreListing", item)}
      >
        <Text style={{fontSize:15, color:color.darkgray}}>{'#  '+ item.name}</Text>
      </Pressable>
    )
  }

  const SuggestHeader = () => {
    return(
      <View style={{padding: 12 }}>
        <Text style={{color: color.darkBrown}}>Suggested categories</Text>
      </View>
    )
  }

  //----------------------------------
  const [ SearchType, setSearchType ] = useState(2) // 1 == post , 2 == user
  const [ placeholder, setPlaceholder ] = useState("Search users")

  const Action = (v) => {
    if (v == 1) setSearchType(1)
    else if (v == 2) setSearchType(2)
  }

  useEffect(() => { 
    if (SearchType == 1 ) {
      setPlaceholder("Search posts")
    }
    else if (SearchType == 2 ) {
      setPlaceholder("Search users")
    }
  }, [ SearchType ])

  const onSubmit = () => {
    if (SearchType == 1 ) { // 1 == post , 2 == user
      navigation.navigate("ExploreListing", {title: Search.trim()})
    }
    else if (SearchType == 2 ) {
      navigation.navigate("ExploreSearchUser", {title: Search.trim()})
    }
  }

  return (
    <View style={styles.container}>
      <View style={{height:60, width:width, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
        <View style={styles.search}>
          <EvilIcons name="search" size={25} color={color.black} />
          <TextInput
            style={{paddingLeft:10, width:"90%", color:color.black}}
            placeholder={placeholder}
            placeholderTextColor={color.gray}
            onChangeText={(text) => setSearch(text)}
            onSubmitEditing={() => onSubmit() }
          />
        </View>
        <Menu onSelect={value => Action(value)}>
          <MenuTrigger><Ionicons name="filter" size={25} color={color.black} style={{marginRight:10}}/></MenuTrigger>
          <MenuOptions>
              <MenuOption value={1}>
                <Text style={{ margin:10, color:color.black}}>Search posts</Text>
              </MenuOption>
              <MenuOption value={2}>
                <Text style={{ margin:10, color:color.black}}>Search users</Text>
              </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <FlatList
        ListHeaderComponent={ 
          <SuggestHeader/>
        }
        data={SearchCate}
        keyExtractor={(index) =>  index}
        horizontal={false}
        // numColumns={2}
        numColumns={1}
        renderItem={categoryList}
        // renderItem={Category}
      /> 
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop:40,
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  search:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    // marginLeft:30,
    // marginRight:30,
    // borderWidth:1,
    width:"80%",
    backgroundColor:color.faintgray,
    // marginTop:30,
  },
});


const SearchStart = styled.View`
  padding: 10px 0 5px 0;
`;
