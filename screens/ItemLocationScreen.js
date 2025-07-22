import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '../contexts/ThemeContext';

const ItemLocationScreen = () => {
  const navigation = useNavigation();
  const { darkMode, largeText } = useTheme();
  const route = useRoute();
  const { poiLocation, poiName } = route.params;

  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const mapRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionGranted(status === 'granted');
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();
  }, []);

  // Zoom and center map at user and poi
  useEffect(() => {
    if (mapRef.current && (userLocation || poiLocation)) {
      // Calculate region that includes both user and poi (if there's a user)
      const latitudes = [poiLocation.latitude];
      const longitudes = [poiLocation.longitude];

      if (userLocation) {
        latitudes.push(userLocation.latitude);
        longitudes.push(userLocation.longitude);
      }

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      const latDelta = (maxLat - minLat) * 1.5 || 0.05;
      const lngDelta = (maxLng - minLng) * 1.5 || 0.05;

      mapRef.current.animateToRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      }, 1000);
    }
  }, [userLocation, poiLocation]);

  if (!locationPermissionGranted) {
    return (
      <View style={styles.center}>
        <Text>Location permission is required to show the map.</Text>
      </View>
    );
  }

  if (!userLocation && !poiLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: poiLocation.latitude,
          longitude: poiLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {poiLocation && (
          <Marker
            coordinate={poiLocation}
            title={poiName}
          />
        )}
      </MapView>
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} className={`w-10 h-10 rounded-md items-center justify-center ${darkMode? "bg-neutral-900" : "bg-white"}`}>
          <FontAwesome5 name="chevron-left" size={24} color="#D81B60" />
        </TouchableOpacity>
        <View className={`flex-row justify-center items-center ${darkMode? "bg-neutral-900" : "bg-white"} p-2 rounded-md h-[36px]`}>
          <Text className={`${largeText ? 'text-2xl' : 'text-lg'} black text-pink-600 font-semibold`}>
            {poiName?.length >28  ? `${poiName.slice(0,28)}...` : poiName}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    flex: 1,
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});

export default ItemLocationScreen;
