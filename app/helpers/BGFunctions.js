import { BACKEND } from "../config/config";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { GET, getNew, getRefreshToken, getToken, storeData, storeToken } from "./functions";
import { refreshCollection} from "../store/actions";
// import { useDispatch } from "react-redux";
    const dispatch = useDispatch()


export const renewToken = () => {
  getRefreshToken().then(token_refresh => {
    fetch(BACKEND + '/token', getNew(token_refresh))
    .then(res => res.json())
    .then(res => {
      // console.log(res.token, token_refresh)
      // dispatch(Token(res.token, token_refresh))
    })
  })  
}
