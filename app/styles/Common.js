import { Dimensions } from "react-native";
import color from "../config/color";

const { width, height } = Dimensions.get("window");

export const Hline = {
        width: "100%",
        margin: 0,
        height: 1,
        backgroundColor: "#e6e6e6"
}

export const Row = {
        flexDirection:"row", 
        alignItems:"center"
}

export const TopRound30 = {
        borderTopLeftRadius:30, 
        borderTopRightRadius:30
}

export const CenterItem = {
        justifyContent:"center", 
        alignItems:"center"
}

export const flashText = {
        fontSize:20, 
        padding:15, 
        color:"white",
        backgroundColor:color.darkBrown, 
        marginBottom:20, 
        position:'absolute', 
        // top:Constants.statusBarHeight-30, 
        alignSelf:"center",
        justifyContent:"center",
        overflow:"hidden",
        borderRadius:20
}