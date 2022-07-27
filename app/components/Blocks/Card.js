import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useEffect} from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import color from '../../config/color';
import { getTimeDif } from "../../helpers/functions"
import extractDomain from "extract-domain";
import { getLinkPreview } from "link-preview-js";
import * as Cards from "./Cards"
import { useNavigation } from '@react-navigation/native';

// styles 
import { CardStyle } from '../../styles';
import { useSelector } from 'react-redux';


const { width, height } = Dimensions.get("window");

export const NormalCards = ({ item, onPress, heartOnPress, onPressPoster, route , dotOnPress, nextRoute }) => {
    
    let isdeleted;
    let deletedPostId = [...useSelector(state => state.postCard.deleted)]
    deletedPostId = deletedPostId.filter(remain => remain == item.id)
    if (deletedPostId.length > 0) isdeleted = true

    let blockId = [ ...useSelector(state => state.folAct.blockId)]
    blockId = blockId.filter(remain => remain == item.userId)
    if (blockId.length > 0) isdeleted = true
    

    let like;
    const redux_like  = useSelector(state => state.postCard.like_post)
    let data = [...redux_like]
    data = data.filter(remain => remain.postId == item.id)
    if ( data.length > 0 ) like = data[0].like_count
    else like = item.like_count
    
    const navigation = useNavigation()

    let domain;
    if (item.link) domain = extractDomain(item.link)
    const timeDif = getTimeDif(item.createdAt)


    if (!item ) return null
    else if (!item.imageLink) {
      const [imgPreview, setImgPreview ] = useState("")
      return (
        <View style={CardStyle.outContainer}>
          <Cards.Link 
            isdeleted={isdeleted}
            likes={like ? like : item.like_count}
            time={timeDif}
            domain={domain}
            tags ={item.tags ? item.tags : "" }
            poster={item.userName}
            avatar={item.userAvatar} 
            link = {item.link} 
            title={item.title} 
            onPress={() => navigation.push( nextRoute, { 
              postData: {...item, like_count:like}, 
              imgPreview: item.imgPreviewLink ? item.imgPreviewLink : imgPreview
            })}
            heartOnPress = {heartOnPress}
            onPressPoster= {onPressPoster}
            imgPreview={ item.imgPreviewLink ? item.imgPreviewLink :imgPreview}
            route={route}
            dotOnPress={dotOnPress}
          />
        </View>
      )
    }
    else {
      return (
        <View style={CardStyle.outContainer}>
          <Cards.PictureCard 
            isdeleted={isdeleted}
            likes={like ? like : item.like_count}
            time={timeDif}
            link = {item.link} 
            title={item.title} 
            tags ={item.tags ? item.tags : "" }
            poster={item.userName} 
            avatar={item.userAvatar}
            image={item.imageLink} 
            imageWidth={width*0.9} 
            imageHeight={(item.imageHeight/item.imageWidth)*width*0.9}
            onPress={() => navigation.push(nextRoute, { 
              postData: {...item, like_count:like}
            })}
            heartOnPress = {heartOnPress}
            onPressPoster= {onPressPoster}
            route={route}
            dotOnPress={dotOnPress}
          />
        </View>
      ) 
    }
}

export const collectionList = ({ onPress, item }) => {
  return (
    <View style={{ justifyContent:"center", alignSelf:"center"}}>
      <TouchableOpacity style={styles.textCollection} onPress={onPress}>
        <View style={{width:"10%", marginHorizontal:20}}>
          <Ionicons name="book-outline" color={color.darkBrown} size ={25} />
        </View>
        <Text style={{fontSize:20, justifyContent:"center", alignSelf:"center", width:"70%", color:color.black}}>{item.name}</Text>
      </TouchableOpacity>
      <View style={{height:1, backgroundColor:color.lightgray, width:width}} />
    </View>
  )
}

const styles = StyleSheet.create({
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
})



