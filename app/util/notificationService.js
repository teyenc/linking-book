import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
//     console.log('Authorization status:', authStatus);
    getFcmToekn()
  }
}

const getFcmToekn = async () => {
        let fcmToken =  await AsyncStorage.getItem("fcmToken")
        if (fcmToken) {
                // console.log("old token _____________________________________")
                // console.log(fcmToken)
                // console.log("_____________________________________")
                return fcmToken
        }
        else if (!fcmToken) {
                try {
                        const fcmToken = await messaging().getToken();
                        if (fcmToken) {
                                // console.log(fcmToken, "new token XDDDD");
                                await AsyncStorage.setItem("fcmToken", fcmToken)
                        } 
                } catch (r) {
                        console.log(r)
                }
        }
}

export const notificationListener = async () => {
        messaging().onNotificationOpenedApp( remoteMessage => {
                console.log(
                        "notification caaused app to open from the background state: ", remoteMessage.notification
                )
        })

        messaging().onMessage(async remoteMessage => {
                console.log("received in foreground", remoteMessage)
        })

        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
                if (remoteMessage) {
                        console.log(
                                "notification caused app to open from quit state",
                                remoteMessage.notification
                        )
                }
        })
}