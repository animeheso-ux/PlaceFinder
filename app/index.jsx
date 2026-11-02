import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Image } from 'react-native';
import {router} from "expo-router"

export default function Index() {

    setTimeout(() => {
        router.push("home")
    }, 2000);

    return (
        <View style={styles.container}>
            <Image source={require("../assets/PlaceFinder Landscape Map Icon.png")} style={{height : 450, width : 400}}/>
        </View>
    )
}



const styles =  StyleSheet.create({
    container : {
        flex : 1,
        alignContent : 'center',
        alignItems : "center",
        justifyContent : "center",
        backgroundColor : "#1b526a"
    }
})