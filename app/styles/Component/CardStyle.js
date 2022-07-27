import { Alert, Dimensions } from "react-native";
import color from "../../config/color";
import { CenterItem } from "../Common";

const { width, height } = Dimensions.get("window");

//helpers
export const LinkPreViewSize = {
        width:width*0.9*0.3,
        height:width*0.9*0.2
}

// main styles

export const ImagePreview = {
        ...LinkPreViewSize,
        resizeMode:"cover",
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
}

export const Avatar = {
        width:30, 
        height:30, 
        borderRadius:40
}

export const outContainer = {
        width:"90%", 
        // margin:10, 
        alignItems:"center", 
        alignSelf:"center"
}

export const LinkContainer = {
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor:"white",
        borderRadius:12,
        margin:10
}

export const LinkContainer1 = {
        flexDirection:"row", 
        // justifyContent:"center",
        alignItems:"center",
        justifyContent:"space-evenly", 
        paddingVertical:20, 
        paddingLeft:30
}

export const LinkPreViewContainer = {
        ...CenterItem,
        ...LinkPreViewSize
}

export const DomainContainer = {
        width:width*0.9*0.3, 
        height:width*0.9*0.05, 
        backgroundColor:color.gray, 
        borderBottomLeftRadius:5, 
        borderBottomRightRadius:5, 
        paddingLeft:3, 
        flexDirection:"row",
        alignItems:"center"
}

export const DomainText = {
        marginLeft:2, 
        fontSize:12, 
        color:"white"
}

export const LinkTitleCtnr = {
        paddingHorizontal:30, 
        width:width*0.9*0.7, 
        justifyContent:"center"
}

export const TagCtnr = {
        flexDirection:"row", 
        flexWrap:"wrap", 
        paddingHorizontal:15
}

export const TagText = {
        textDecorationLine: "underline", 
        color:color.gray,
        marginHorizontal: 3
}

export const TitleText = {
        fontSize:17, 
        fontWeight:"500",
        color:color.black
}

export const IconAvatar = {
        backgroundColor:color.lightgray, 
        height:30, 
        width:30, 
        borderRadius:width*0.1, 
        justifyContent:"center", 
        alignItems:"center"
}

export const LikeContainer = {
        width:80, 
        flexDirection:"row", 
        alignItems:"center", 
        justifyContent:"flex-end", 
        paddingRight:5
}

export const TimeText = {
        color:color.gray, 
        marginLeft:15, 
        paddingRight:"70%",
        fontSize:11
}

export const AvtrRowCtnr = {
        margin:10, 
        flexDirection:"row", 
        alignItems:"center", 
        width:width * 0.9 -140
}

export const BtnCinr ={ 
        alignItems:"flex-end",
        padding: 5
}

export const imageContainer = {
        width:"100%", 
        backgroundColor:color.faintgray,
        borderTopRightRadius:12, 
        borderTopLeftRadius:12, 
        marginBottom:10,
        overflow:"hidden"
}

