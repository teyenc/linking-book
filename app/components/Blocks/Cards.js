import React from "react";
import { Dimensions, View, FlatList, TouchableOpacity, StyleSheet, Text, Pressable,Linking, Alert } from "react-native";

//import components
import * as Lists from "./List";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import { openLink } from "../../helpers/functions";

//library
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import FastImage from 'react-native-fast-image'
import { Thumbnail } from 'react-native-thumbnail-video';
import * as WebBrowser from 'expo-web-browser';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

//import styles and assets
import { CardStyle } from '../../styles';
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";

const { width, height } = Dimensions.get("window");

// Cards 
export const Link = ({ link, title, onPress, poster, heartOnPress, avatar, tags, time, likes, onPressPoster, domain, imgPreview, route, dotOnPress, isdeleted}) =>  {
  if (isdeleted) return null
  else {
    return(
      <View style={CardStyle.LinkContainer}>
        <Pressable onPress={onPress}>
          <View style={CardStyle.LinkContainer1}>
            <View style={CardStyle.LinkPreViewContainer}>
              <LinkPreview link={link} domain={domain} imgPreview={imgPreview} />
              <View style={CardStyle.DomainContainer}>
                <Text numberOfLines={1} style={CardStyle.DomainText}>{domain}</Text>
              </View>
            </View> 
            <View style={CardStyle.LinkTitleCtnr}><Text style={CardStyle.TitleText}>{title}</Text></View>
          </View>
          <Tags tags={tags} onPress={onPress}/>
        </Pressable>
  
        <View style={{flexDirection:"row", alignItems:"center", width:"100%"}}>
          <AvatarRow onPressPoster={onPressPoster} poster={poster} time={time}  avatar={avatar}/> 
          <Like likes={likes} onPress={onPress}/>
          <CardBtn route={route} heartOnPress={heartOnPress} dotOnPress={dotOnPress} />
        </View>
      </View>
    )
  }

}

export const PictureCard = ({image, onPressPoster,title, onPress, poster, heartOnPress, imageWidth, imageHeight, avatar, tags, time, likes, route, dotOnPress, isdeleted }) => {
  if (isdeleted) return null
  return (
    <Pressable onPress={onPress} style={{margin:10}}>
      <Rounded style={styles.rounded}>
        <Pressable style={CardStyle.imageContainer} onPress={onPress}>
          {/* <Cache.Image uri={ image } style={{width: imageWidth, height:imageHeight}} /> */}
          <FastImage 
            style={{width: imageWidth, height:imageHeight}} 
            source={{ uri: image, priority: FastImage.priority.high}}    
          />
        </Pressable>
        <Tags tags={tags} onPress={onPress}/>
        <Pressable style={{marginHorizontal:16, marginTop:5}} onPress={onPress}>
          <View style={{ width:width*0.9*0.7, justifyContent:"center"}}><Text style={CardStyle.TitleText}>{title}</Text></View>
        </Pressable>
        <View style={{flexDirection:"row", width:"100%", alignItems:"center"}}>
          <AvatarRow onPressPoster={onPressPoster} poster={poster} time={time}  avatar={avatar}/> 
          <Like likes={likes} onPress={onPress}/>
          <CardBtn route={route} heartOnPress={heartOnPress} dotOnPress={dotOnPress} />
        </View>
      </Rounded>  
    </Pressable>
  );
};
 
// card  components 
export const Like = ({ onPress, likes}) => {
  return(
    <View>
      { likes !== 0 ?
        <Pressable style={CardStyle.LikeContainer} onPress={onPress} >
          <Text style={{marginRight:5, color:color.black}} >{likes}</Text>
          <EvilIcons color={color.gray} name="heart" size={20} />
        </Pressable>
        : <Pressable style={{width:80}} onPress={onPress}/>
      }
    </View>
  )
}

export const CardBtn = ({ route, dotOnPress, heartOnPress}) => {
  return(
    <View>
      { route? [
        route =="PostInMyCollection" ? 
          <TouchableOpacity style={CardStyle.BtnCinr} onPress={dotOnPress}>
            <Ionicons color={color.black} style={{fontSize:18}} name="ellipsis-vertical-outline"/>
          </TouchableOpacity>
          :
          <TouchableOpacity style={CardStyle.BtnCinr} onPress={heartOnPress}>
            <Ionicons color={color.black} style={{fontSize:30}} name="add-outline"/>
          </TouchableOpacity>
        ]
        :
        <TouchableOpacity style={CardStyle.BtnCinr} onPress={heartOnPress}>
          <Ionicons  color={color.black} style={{fontSize:30}} name="add-outline"/>
        </TouchableOpacity>
      }
    </View>
  )
}

export const AvatarRow = ({ avatar, onPressPoster, poster, time}) => {
  return(
    <Pressable onPress={onPressPoster} style={CardStyle.AvtrRowCtnr}>
      {avatar?
        // <Cache.Image style={CardStyle.Avatar} uri={ avatar } />
        <FastImage 
          style={CardStyle.Avatar} 
          source={{ uri: avatar, priority: FastImage.priority.high}}    
        />
        :
        <View style={CardStyle.IconAvatar} >
          <AntDesign name="user" size={15} color="white" />
        </View>
      }
      <View style={{marginLeft:10}}></View>
      <View style={{maxWidth:width*0.35 }}>
        <Typography.Sub1 color={color.black} style={{ flex:1}}>{poster}</Typography.Sub1>
      </View>
      <Text style={CardStyle.TimeText}>{time}</Text>
    </Pressable>
  )
}

export const Tags = ({ tags, onPress }) => {
  return(
    <View>
      { tags? 
        <Pressable style={CardStyle.TagCtnr} onPress={onPress}>
          { tags.map((item, i) => (
                <Text style={CardStyle.TagText}>{`# ` + item.name}</Text>
            ))
          }
        </Pressable> :null
      }
    </View>
  )
}

export const LinkPreview = ({link, domain, imgPreview }) => {

  return (
    <View style={{height:width*0.9*0.2}}>
    {domain == "youtube.com" && link.includes("watch")?
      <Thumbnail 
        url={link} 
        containerStyle ={CardStyle.LinkPreViewContainer}
        iconStyle={{ height:20, width:20}}
        imageStyle={{
          borderTopLeftRadius:5,
          borderTopRightRadius:5,
        }}
        imageWidth={width*0.9*0.3}
        imageHeight={width*0.9*0.2}
        onPress={() => openLink(link)}
      />
      : [
        imgPreview ? 
        <Pressable style={CardStyle.LinkPreViewContainer} onPress={() => openLink(link)}>
          <FastImage 
            style={CardStyle.ImagePreview} 
            source={{ uri: imgPreview, priority: FastImage.priority.high}}    
          />
          {/* <Cache.Image style={CardStyle.ImagePreview} uri={ imgPreview } /> */}
        </Pressable> 
        :
        // <View style={{backgroundColor:"red", height:30, width:30}}/>
        <Pressable style={{        
          justifyContent:"center", 
          alignItems:"center",
          width:width*0.9*0.3,
          height:width*0.9*0.2,
          backgroundColor:color.lightBrown,
          borderTopLeftRadius:5,
          borderTopRightRadius:5
        
        }} onPress={() => openLink(link)}>
          <MaterialIcons name="web" size={40} />
        </Pressable> 
      ]

    }
  </View>
  )
}

export const Default = ({action, image, title, secondary, Rating, sub, meta, onPress }) => {
  return (
    <Rounded
      style={{
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      {image && (
        <ImageContainer>
          <MainImage source={{ uri: image }} />
        </ImageContainer>
      )}
      <View style={{ marginHorizontal: 20, marginVertical: 16 }}>
        {meta && <Typography.SP color={color.gray}>{sub}</Typography.SP>}
        <Typography.H2 color={color.black}>{title}</Typography.H2>
        {secondary && (
          <Typography.P color={color.gray} numberOfLines={1}>
            {secondary}
          </Typography.P>
        )}
      </View>
    </Rounded>
  );
};

export const Category = ({image, title, onPress,}) => {
  return (
    <Rounded style={{ width: "100%",shadowColor: "#000",shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.12,shadowRadius: 5,elevation: 5,}}>
        <TouchableOpacity onPress={onPress}>
            <View style={{width:"100%", height:100, borderRadius:12, overflow:"hidden"}}>
              <ImageBackground style={{width:"100%", height:"100%", alignItems:"center", flex:1, justifyContent:"center"}} source={{ uri: image }}>
                <Text style={{fontSize:40, fontWeight:"500", color:"white"}}>{title}</Text>
              </ImageBackground>
            </View>
        </TouchableOpacity>
    </Rounded>
  );
};

export const NewCategory = ({image, title, onPress,}) => {
  return (
    <Rounded style={{ width: "100%",shadowColor: "#000",shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.12,shadowRadius: 5,elevation: 5,}}>
        <TouchableOpacity onPress={onPress}>
            <View style={{width:"100%", height:100, borderRadius:12, overflow:"hidden"}}>
              <ImageBackground style={{width:"100%", height:"100%", alignItems:"center", flex:1, justifyContent:"center"}} source={image}>
                <View style ={{width:"100%", height:"100%", backgroundColor:"#000000AA", opacity:0.8 , alignItems:"center", justifyContent:"center"}} >
                  <Text style={{fontSize: 20, fontWeight:"500", color:"white"}}>{title}</Text>
                </View>
              </ImageBackground>
            </View>
        </TouchableOpacity>
    </Rounded>
  );
};



export const List = ({ data }) => {
  return (
    <ListCard>
      <View>
        <Typography.Sub1 color={color.gray}>{data.title}</Typography.Sub1>
      </View>
      <FlatList
        data={data.data}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View>
            <View style={{ marginVertical: 15 }}>
              <Typography.P color={color.black}>{item.title}</Typography.P>
              <Typography.P color={color.gray}>{item.detail}</Typography.P>
            </View>
            <HLine />
          </View>
        )}
        scrollEnabled={false}
      />
    </ListCard>
  );
};

export const Review = ({ imagexsmall, secondary, title, content }) => {
  return (
    <Outlined>
      <Lists.UserList
        title={title}
        imagexsmall={imagexsmall}
        secondary={secondary}
      />
      <Typography.P color={color.black} numberOfLines={5}>{content}</Typography.P>
    </Outlined>
  );
};


const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor:"white",
  },
  imageContainer:{
    width:"100%", 
    backgroundColor:color.faintgray,
    borderTopRightRadius:12, 
    borderTopLeftRadius:12, 
    overflow:"hidden"
  },
  images: {
    width: width,
    height: height / 3,
  },
  details: {
    padding:20,
    backgroundColor: 'white',
  },
  title: {
    marginVertical: 3,
  },
  LinkContainer:{
      width: "100%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor:"white",
      borderRadius:12,
  },
  ImagePreview:{
    width: width*0.9*0.3,
    height: width*0.9*0.2,
    resizeMode:"cover",
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
  },
  textContainer:{
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    margin:10
  },
  rounded :{
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  }
});


const Rounded = styled.View`
  background-color: white;
  border-radius: 12px;
`;

const ListCard = styled.View`
  width: 260px;
  height: 270px;
  margin: 0 10px;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: 180px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
`;

const MainImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const HLine = styled.View`
  width: 100%;
  margin: 0 auto;
  height: 1px;
  background-color: #e6e6e6;
`;

const Outlined = styled.View`
  width: 100%;
  height: 240px;
  background-color: white;
  border: 1px solid ${color.lightgray};
  border-radius: 10px;
  padding: 20px;
`;

const ViewMore = styled.View`
  padding: 24px;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${color.faintgray};
`;


const AvatarEmpty = styled.View`
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 35px;
  margin-right: 5px;
  background-color: ${color.lightgray};
`;
