
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import HomeStack from "./app/navigation/HomeStack";

export default function PostPage({ navigation }) {
  navigation.navigate("PostPage")
  

  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
