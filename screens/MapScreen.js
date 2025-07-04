import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getPlacesData } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const MapScreen = () => {
  const navigation = useNavigation();
  const { darkMode, toggleTheme } = useTheme();

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState(null);
  const [regionBounds, setRegionBounds] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  //Gets current location of user
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission not granted');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  // Gets locations from Rapid API
  useEffect(() => {
    const fetchPlacesFromMap = async () => {
      if (mapRef.current) {
        const bounds = await mapRef.current.getMapBoundaries();
        setRegionBounds(bounds);

        const data = await getPlacesData(
          bounds.southWest.latitude,
          bounds.southWest.longitude,
          bounds.northEast.latitude,
          bounds.northEast.longitude,
          'restaurants'
        );

        if (data) {
          setPlaces(data);
        }
      }
    };

    if (mapReady && location) {
      fetchPlacesFromMap();
    }
  }, [mapReady, location]);

  // Zoom on the region with markers
  useEffect(() => {
    if (places.length > 0) {
      const lats = places.map(p => Number(p.latitude));
      const lngs = places.map(p => Number(p.longitude));
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const latDelta = (maxLat - minLat) * 1.5 || 0.05;
      const lngDelta = (maxLng - minLng) * 1.5 || 0.05;
      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
    }
  }, [places]);

  if (!location || !region) {
    return (
      <View style={styles.center} className={`${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
        <ActivityIndicator size="large" />
        <Text>Getting current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        onMapReady={() => setMapReady(true)}
      >
        {places?.map((place, i) => (
            place.latitude && place.longitude && (
            <Marker
                key={i}
                coordinate={{
                latitude: Number(place.latitude),
                longitude: Number(place.longitude),
                }}
            >
                <Callout
                tooltip={true} // default styling, you can set true for full customization
                onPress={() => navigation.navigate('ItemScreen', { param: place })}
                >
                <View style={{ width: 200, padding: 5 }} className={`px-4 py-4 rounded-xl ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
                    <Text className={`font-bold ${darkMode ? "text-neutral-100" : "text-neutral-900"}`}>{place?.name}</Text>
                    <Text numberOfLines={2} className={`mb-4 ${darkMode ? "text-neutral-300" : "text-neutral-900"}`}>
                    {place?.address || place?.location_string}
                    </Text>
                    <TouchableOpacity
                    style={{
                        backgroundColor: '#D81B60',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 5,
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('ItemScreen', { param: place })}
                    >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        Show Item →
                    </Text>
                    </TouchableOpacity>
                </View>
                </Callout>
            </Marker>
            )
        ))}
      </MapView>

      <SafeAreaView style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} className={`w-10 h-10 rounded-md items-center justify-center ${darkMode? "bg-neutral-900" : "bg-white"}`}>
          <FontAwesome5 name="chevron-left" size={24} color="#D81B60" />
        </TouchableOpacity>
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
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
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

export default MapScreen;
