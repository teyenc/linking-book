import { DefaultTheme } from "@react-navigation/native";

//import styles and assets
import color from "../config/color";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: color.deepgreen,
  },
};
