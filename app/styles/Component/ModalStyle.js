import { Alert, Dimensions } from "react-native";
// import { Common } from "..";
import color from "../../config/color";
// import { TopRound30, Row, CenterItem } from "../Common";

const { width, height } = Dimensions.get("window");

//collection Modal
export const ColtMdlCtnr = {
        paddingTop:"30%", 
        backgroundColor: "#000000AA"
}

export const ColtMdlCtnr1 = {
        flex: 1, 
        backgroundColor:"#000000AA"
}

export const ColtMdlCtnr2 = {
        backgroundColor:"white", 
        height:"100%",
        // ...TopRound30,
        borderTopLeftRadius:30, 
        borderTopRightRadius:30
}

export const ColtMdlCtnr3 = {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:"center", 
        alignItems:"center",
        borderTopLeftRadius:30, 
        borderTopRightRadius:30
}

export const coltTxtBox = {
        paddingLeft:10, 
        width:"100%", 
        height:150,
        color:color.black
}

export const newColtForm = {
        flexDirection:"row", 
        alignItems:"center",
        borderColor:color.gray, 
        borderRadius:25, 
        padding:10,
        marginVertical:10,
        width:"100%",
        backgroundColor:color.faintgray
}
export const ColtOption = {
        width:"100%", 
        height: 90, 
        alignItems:"center", 
        justifyContent:"center"
}

export const ColtRowAdd = { 
        flexDirection:"row", 
        alignItems:"center",
        justifyContent:"space-evenly",
        paddingHorizontal:20, 
        marginVertical:10
}




