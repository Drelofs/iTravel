import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const MapScreen = () => {

    const navigation = useNavigation();

    const [mainData, setMainData] = useState([]);
    const [bl_lat, setBl_lat] = useState(null);
    const [bl_lng, setBl_lng] = useState(null);
    const [tr_lat, setTr_lat] = useState(null);
    const [tr_lng, setTr_lng] = useState(null);

    const [location, setLocation] = useState(null);
    const [regionBounds, setRegionBounds] = useState(null);
    const mapRef = useRef(null);

    console.log(location);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown : false,
        })
    }, []);

    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Location permission not granted');
            return;
          }
    
          const { coords } = await Location.getCurrentPositionAsync({});
          setLocation(coords);
        })();
    }, []);

    const onRegionChangeComplete = async () => {
        if (mapRef.current) {
          const bounds = await mapRef.current.getMapBoundaries();
          setRegionBounds(bounds);
        }
      };
    
      if (!location) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text>Getting current location...</Text>
          </View>
        );
      }

    return (
        <View className="relative flex-1">
            <View className="absolute inset-x-5 top-5 z-99 bg-white shadow-lg">
            </View>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                    }}
                    showsUserLocation={true}
                    onRegionChangeComplete={onRegionChangeComplete}
                >
                    <Marker coordinate={location} title="You are here" />

                </MapView>

                <SafeAreaView className="absolute flex-row inset-x-0 top-5 left-5 z-99 justify-between px-6">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-md items-center justify-center bg-white">
                        <FontAwesome5 name="chevron-left" size={24} color="bg-[#06B2BE]" />
                    </TouchableOpacity>
                </SafeAreaView>

                {regionBounds && (
                    <View style={styles.info}>
                    <Text style={styles.title}>Visible Map Bounds:</Text>
                    <Text>Bottom Left (SW):</Text>
                    <Text>Latitude: {regionBounds.southWest.latitude}</Text>
                    <Text>Longitude: {regionBounds.southWest.longitude}</Text>
                    <Text>Top Right (NE):</Text>
                    <Text>Latitude: {regionBounds.northEast.latitude}</Text>
                    <Text>Longitude: {regionBounds.northEast.longitude}</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      padding: 10,
      backgroundColor: 'white',
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
  });

export default MapScreen