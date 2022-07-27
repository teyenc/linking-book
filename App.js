import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthStack from './app/navigation/AuthStack';
import navigationTheme from "./app/navigation/navigationTheme";
import store from "./app/store/store";
import Icon from 'react-native-vector-icons/MaterialIcons'

//library 
import { MenuProvider } from 'react-native-popup-menu';
import FlashMessage from "react-native-flash-message";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

// import redux 
import { Provider, useDispatch, useSelector } from "react-redux";
import { storeData } from './app/helpers/functions';
import color from './app/config/color';

Icon.loadFont();
LogBox.ignoreAllLogs();//Ignore all log notifications
 
import { StatusBar, StyleSheet,Dimensions, LogBox, Platform, Text, View } from 'react-native';
import { notificationListener, requestUserPermission } from './app/util/notificationService';
import { navigationRef } from './RootNavigation';
// import { View } from 'react-native-web';

const App = () => {
  
  const { width, height } = Dimensions.get("window");

  storeData("HomeLoadingPage", "2")

  async function getToken ()  {
    let fcmToken =  await AsyncStorage.getItem("fcmToken")
    if (fcmToken) {
      // console.log(fcmToken)
    }
  }

  React.useEffect(() => {
    // requestUserPermission()
    // console.log("_AA")
    // notificationListener()
  //   getToken()
  }, [])

  return (
    <Provider store={store}>
      <MenuProvider>
        <NavigationContainer theme={navigationTheme}>
          <SafeAreaView style={{ width:width, backgroundColor:"white", flex:1}}>
            <StatusBar backgroundColor="white" translucent={true} hidden={false} barStyle={'dark-content'}/>
          {/* </SafeAreaView> */}
            <AuthStack/>
          </SafeAreaView>
        </NavigationContainer>
      </MenuProvider>
      <FlashMessage 
        floating={true}
        duration={1000}
        style={{ 
          backgroundColor:color.darkBrown, 
          marginTop:Platform.OS =="ios"? 0: (StatusBar.currentHeight + 10),marginRight: width* 0.28, marginLeft:width*0.28, 
          alignItems:"center", 
          justifyContent:"center" 
        }}
        titleStyle={{fontSize:18}}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
