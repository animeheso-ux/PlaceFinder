import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from "expo-location"
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import MapView, { Marker } from "react-native-maps"


export default function HomeScreen() {
    const [location, setLocation] = useState(null)
    const [touristSpots,setTouristSpots] = useState([])


    async function getPermissions() {

        const { status } = await Location.requestForegroundPermissionsAsync();


        if (status !== "granted") {
            return Alert.alert("perms not granted")
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);


         const touristspots = await getNearbyTouristSpots(currentLocation.coords.latitude,currentLocation.coords.longitude)
         setTouristSpots(touristspots)
    }

    async function getNearbyTouristSpots(latitude, longitude) {
  const query = `
    [out:json][timeout:25];
    (
      nwr["tourism"="attraction"](around:500,${latitude},${longitude});
      nwr["tourism"="museum"](around:500,${latitude},${longitude});
      nwr["leisure"="park"](around:500,${latitude},${longitude});
    );
    out center;
  `;

  const response = await fetch(
    "https://overpass.private.coffee/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: new URLSearchParams({ data: query }).toString(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Overpass ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.elements;
}


    useEffect(() => {
        getPermissions()
    }, [])


    return (
        <View style={styles.container}>
            <Text>Home</Text>
            {location && (
                <>
                    <MapView style={styles.map} initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }
                    } showsUserLocation>

                        {touristSpots.map((spot,index)=> {
                            return (
                                <div key={index}>
                                    <Marker coordinate={{latitude : spot.lat,longitude : spot.lon}}         title={spot.tags?.name ?? "Unnamed place"}
        description={spot.tags?.tourism ?? spot.tags?.leisure}/>
                                </div>
                            )
                        })}

                    </MapView>

                </>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: "100%"
    }
})