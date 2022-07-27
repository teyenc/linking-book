import { View, Text, TouchableOpacity, Linking, Dimensions, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";

// import config 
import color from '../../config/color';
import * as Typography from "../../config/Typography";

// import library 
import * as WebBrowser from 'expo-web-browser';
import Hyperlink from 'react-native-hyperlink'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import YoutubePlayer from "react-native-youtube-iframe";
import FastImage from "react-native-fast-image";

//icon
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";



// import component 
import * as Button from "../Blocks/Button";
import { MyPostsSetting, ReportModal, SaveModal } from '../Blocks/Modals';
import { useSelector } from "react-redux";
import { getTimeDif, youtube_parser, openLink } from "../../helpers/functions";

const { width, height } = Dimensions.get("window");

export const Description = ({ content }) => {
    return(
        <View style={{ paddingTop:10}}>
            <Hyperlink linkDefault={true} linkStyle={ { color: '#2980b9',textDecorationLine:"underline"}}>
            <Text style={{fontSize:15, fontWeight:"300", color:color.black}}>{content}</Text>
            </Hyperlink>
        </View>    
    )
}

export const Visit = ({ link }) => {
    if (!link) { return ( null) }
    else {
        return (
        <View style={{width:"30%"}}>
            <Button.BtnContain label="Visit" color={color.gray} onPress={() => openLink(link)} />
        </View> 
    )}
}

export const TextCollection  = ({ item, onPress }) => {
    return (
      <TouchableOpacity style={styles.textCollection} onPress={onPress}>
        <Text style={{fontSize:24, justifyContent:"center", alignSelf:"center", color:color.black}}>{item.name}</Text>
      </TouchableOpacity>
    )
}

export const PostDetailCpnt = ({
    toUserProfile,
    avatar,
    posterName,
    PostData,
    isLoadingFol,
    link,
    like_count,
    isChecking,
    isLike,
    title,
    saveOnPress,
    pressLike,
    content,
    tags,
    isFol,
    unfollow,
    follow,
    dotsOnPress,
    PressLink,
    imgPreview,
    imageLink,
    domain,
    createdTime,
    posterId
}) => {
    const UserData = useSelector(state => state.auth)
    return (
        <View style={{flex:1, backgroundColor:color.faintgray}}>
            <View style={{backgroundColor:"white", paddingVertical:10}}>
            {/* topRow */}
            <View style={{flexDirection:"row"}}>
                <Pressable style={{ paddingLeft:10,marginVertical:10, flexDirection:"row", alignItems:"center",width:"60%"}} onPress= {toUserProfile}>
                { (!avatar) ?
                    <View style={{ backgroundColor:color.lightgray, height:40, width:40, borderRadius:width*0.1, justifyContent:"center", alignItems:"center"}} >
                        <AntDesign name="user" size={15} color="white" />
                    </View>
                    :
                    // <Cache.Image style={{width:35, height:35, borderRadius:40}} uri={avatar} />
                    <FastImage 
                        style={{width:35, height:35, borderRadius:40}} 
                        source={{ uri: avatar, priority: FastImage.priority.high}}    
                    />
                }
                <View style={{width:5}}></View>
                <View style={{ width:160, flexDirection:"row", alignItems:"center"}}>
                    <Typography.Sub1 color={color.black} style={{ flex:1}}> {posterName}</Typography.Sub1>
                    <Text style={{color:color.gray, marginLeft:10, fontSize:13}}>{getTimeDif(createdTime)}</Text>
                </View>
                </Pressable>
                { posterId == UserData.id ? 
                    <View style={{width:"25%"}}/> :
                    [ isLoadingFol? 
                        <View style={{width:"25%", justifyContent:"center",alignItems:"center"}}>
                            <ActivityIndicator/>
                        </View> :
                        [
                        isFol?  
                        <Pressable style={{width:"25%", justifyContent:"center",alignItems:"center"}} onPress={unfollow}>
                            <Text style={{color:color.gray}} >following</Text>
                        </Pressable>
                        :
                        <Pressable style={{width:"25%", justifyContent:"center",alignItems:"center"}} onPress={follow} >
                            <Text style={{color:color.darkBrown, fontWeight:"bold"}}>Follow</Text>
                        </Pressable>
                        ]
                    ]
                }
                <View style={{flexDirection:"row-reverse", width:"15%"}}>
                <TouchableOpacity style={{justifyContent:"center", paddingHorizontal:20}} onPress={dotsOnPress}>
                    <Ionicons color={color.black}  size={20} name="ellipsis-vertical-outline"/>
                </TouchableOpacity>
                </View>
            </View>
            
            { (!imageLink) ? 
                [ domain == "youtube.com" && link.includes("watch")?
                    <YoutubePlayer
                        width={width}
                        height={width*0.6}
                        videoId={youtube_parser(link)}
                    />
                    :
                    [ !imgPreview ? 
                        <View>
                        <Pressable onPress={PressLink} style={{width:width, height:0.75* width, backgroundColor:color.lightBrown, alignItems:"center", justifyContent:"center"}}>
                            <MaterialIcons name="web" size={100} />
                        </Pressable>
                        <View style={{backgroundColor:color.lightgray, height:30,flexDirection:"row",alignContent:"center", justifyContent:"center", borderTopWidth:0}}>
                            <Text style={{alignSelf:"center", marginRight:10, color:color.black}}>{domain}</Text>
                            <Ionicons color={color.black}  name="open-outline" size={20} style={{alignSelf:"center"}}/>
                        </View>
                        </View>
                        :
                        <Pressable onPress={PressLink}>
                        {/* <Cache.Image style={{width:width, height:0.75* width}} uri = {imgPreview} /> */}
                            <FastImage
                                style={{width:width, height:0.75* width}} 
                                source={{ uri: imgPreview, priority: FastImage.priority.high}}    
                            />
                            <View style={{backgroundColor:color.lightgray, height:30,flexDirection:"row",alignContent:"center", justifyContent:"center"}}>
                                <Text style={{alignSelf:"center", marginRight:10, color:color.black}}>{domain}</Text>
                                <Ionicons color={color.black}  name="open-outline" size={20} style={{alignSelf:"center"}}/>
                            </View>
                        </Pressable>
                    ]
                ]
                : 
                null
            }
            
            {(!imageLink) ? null : 
                <TouchableOpacity onPress={PressLink} style={{alignContent:"center",}} >
                    {/* <Cache.Image style={{width:width, height: PostData.imageHeight/PostData.imageWidth * width }} uri={PostData.imageLink } /> */}
                    <FastImage 
                        style={{width:width, height: width }} 
                        source={{ uri: imageLink, priority: FastImage.priority.high}}    
                    />
                </TouchableOpacity>
            }

            <View style={{paddingHorizontal:15}} >
                {/* Button */}
                <View style={{paddingVertical:20, flexDirection:"row", justifyContent:"space-evenly"}}>
                <Visit link = {link}/>
                <View style={{width:"30%"}}>
                    <Button.BtnContain label="Save" color={color.darkBrown} onPress={saveOnPress}/>
                </View>
                </View>

                {/*  like_count */}
                {like_count != 0 ? 
                    <Text style={{marginBottom:5, color:color.black}}>{like_count} likes</Text>
                :null
                }

                <View style={{flexDirection:"row", paddingVertical:0}}>
                { isChecking ? <ActivityIndicator color={color.darkBrown}/> 
                    :
                    <TouchableOpacity style={{}} onPress={pressLike}>
                    {isLike ? 
                        <Ionicons name="heart" size={30} color={color.gray}/>:
                        <Ionicons name="heart-outline" size={30} color={color.gray}/>
                    }
                    </TouchableOpacity>
                }
                </View>

                <View style={{paddingTop:10}}>
                    <Text style={{fontSize:24, fontWeight:"400", color:color.black}}>{title}</Text>
                </View>
                <Description content={content} />
            
                {/* tags  */}
                {(!tags ) ? null : 
                <View style={{ flexDirection:"row", flexWrap:"wrap", paddingTop:5}} >
                    {tags.map((item, i) => (
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

    // old component 
    // const PostCpnt = () => {
    //   return (
    //     <View style={{flex:1, backgroundColor:color.faintgray}}>
    //       <View style={{backgroundColor:"white", paddingVertical:10}}>
    //         <View style={{flexDirection:"row"}}>
    //           <Pressable style={{ paddingLeft:10,marginVertical:10, flexDirection:"row", alignItems:"center",width:"60%"}} onPress= {()=> toUserProfile()}>
    //             { (!avatar) ?
    //               <View style={{ backgroundColor:color.lightgray, height:40, width:40, borderRadius:width*0.1, justifyContent:"center", alignItems:"center"}} >
    //                 <AntDesign name="user" size={15} color="white" />
    //               </View>
    //               :
    //               <Cache.Image style={{width:35, height:35, borderRadius:40}} uri={avatar} />
    //             }
    //             <View style={{width:5}}></View>
    //             <View style={{ width:160, flexDirection:"row", alignItems:"center"}}>
    //               <Typography.Sub1 color={color.black} style={{ flex:1}}> {posterName}</Typography.Sub1>
    //               <Text style={{color:color.gray, marginLeft:10, fontSize:13}}>{getTimeDif(PostData.createdAt)}</Text>
    //             </View>
    //           </Pressable>
    //             { PostData.userId == UserData.id ? 
    //               <View style={{width:"25%"}}/> :
    //               [ isLoadingFol? 
    //                   <View style={{width:"25%", justifyContent:"center",alignItems:"center"}}>
    //                     <ActivityIndicator/>
    //                   </View> :
    //                   [
    //                     isFol?  
    //                     <Pressable style={{width:"25%", justifyContent:"center",alignItems:"center"}} onPress={() => unfollow()}>
    //                       <Text style={{color:color.gray}} >following</Text>
    //                     </Pressable>
    //                     :
    //                     <Pressable style={{width:"25%", justifyContent:"center",alignItems:"center"}} onPress={() => follow()} >
    //                       <Text style={{color:color.darkBrown, fontWeight:"bold"}}>Follow</Text>
    //                     </Pressable>
    //                   ]
    //               ]
    //             }
    //           <View style={{flexDirection:"row-reverse", width:"15%"}}>
    //             <TouchableOpacity style={{justifyContent:"center", paddingHorizontal:20}} onPress={() => dotsOnPress()}>
    //               <Ionicons size={20} name="ellipsis-vertical-outline"/>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
            
    //         { (!PostData.imageLink) ? 
    //           [
    //             domain == "youtube.com" ?
    //             <YoutubePlayer 
    //               width={width}
    //               height={width*0.6}
    //               videoId={youtube_parser(link)}
    //             />
    //             :
    //             <Pressable onPress={() => openAppBrows()}>
    //               {/* <Cache.Image style={{width:width, height:0.75* width}} uri = {imgPreview} /> */}
    //               <FastImage 
    //                 style={{width:width, height:0.75* width}} 
    //                 source={{ uri: imgPreview, priority: FastImage.priority.high}}    
    //               />
    //               <View style={{backgroundColor:color.lightgray, height:30,flexDirection:"row",alignContent:"center", justifyContent:"center"}}>
    //                 <Text style={{alignSelf:"center", marginRight:10}}>{domain}</Text>
    //                 <Ionicons name="open-outline" size={20} style={{alignSelf:"center"}}/>
    //               </View>
    //             </Pressable>
    //           ]
    //           : 
    //           null
    //         }
            
    //         {(!PostData.imageLink) ? null : 
    //           <TouchableOpacity onPress={() => openAppBrows()} style={{alignContent:"center",}} >
    //             <Cache.Image style={{width:width, height: PostData.imageHeight/PostData.imageWidth * width }} uri={PostData.imageLink } />
    //           </TouchableOpacity>
    //         }

    //         <View style={{paddingHorizontal:15}} >
    //           {/* Button */}
    //           <View style={{paddingVertical:20, flexDirection:"row", justifyContent:"space-evenly"}}>
    //             <Visit link = {link}/>
    //             <View style={{width:"30%"}}>
    //               <Button.BtnContain label="Save" color={color.darkBrown} 
    //                 onPress={() => heartOnPress(postId)}
    //               />
    //             </View>
    //           </View>
    //           {/*  like_count */}
    //           {like_count != 0 ? 
    //               <Text style={{marginBottom:5}}>{like_count} likes</Text>
    //             :null
    //           }

    //           <View style={{flexDirection:"row", paddingVertical:0}}>
    //             { isChecking ? <ActivityIndicator color={color.darkBrown}/> 
    //               :
    //               <TouchableOpacity style={{}} onPress={() => pressLike() }>
    //                 {isLike ? 
    //                   <Ionicons name="heart" size={30} color={color.gray}/>:
    //                   <Ionicons name="heart-outline" size={30} color={color.gray}/>
    //                 }
    //               </TouchableOpacity>
    //             }
    //           </View>

    //           <View style={{paddingTop:10}}>
    //             <Text style={{fontSize:24, fontWeight:"400"}}>{title}</Text>
    //           </View>
    //           <Description content={content} />
            
    //           {/* tags  */}
    //           {(!tags ) ? null : 
    //             <View style={{ flexDirection:"row", flexWrap:"wrap", paddingTop:5}} >
    //               {tags.map((item, i) => (
    //                   <View style= {{marginHorizontal: 5, marginTop:5, }}> 
    //                     <Button.BtnTagUnderline
    //                         label =  {`# ` + item.name}
    //                         color={color.darkBrown}
    //                       />
    //                   </View>
    //                 ))
    //               }
    //             </View>
    //           }
    //         </View>
    //       </View>
    //     </View>
    //   )
    // }