import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getPlacesData } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const MapScreen = () => {
  const navigation = useNavigation();
  const { darkMode, largeText } = useTheme();

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState(null);
  const [regionBounds, setRegionBounds] = useState(null);
  const [placeType, setPlaceType] = useState('restaurants'); // 'restaurants' | 'attractions' | 'hotels'

  const isLoadingPlaces = mapReady && !!location && places.length === 0;

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

  // Gets locations from Rapid API based on current map bounds and selected type
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
          placeType
        );

        if (data) {
          setPlaces(data);
        }
      }
    };

    if (mapReady && location) {
      // reset while we fetch a new category
      setPlaces([]);
      fetchPlacesFromMap();
    }
  }, [mapReady, location, placeType]);

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
        <Text className={`${largeText ? 'text-2xl' : 'text-lg'} ${darkMode? "text-neutral-100" : "text-neutral-900"}`}>Getting current location...</Text>
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
          place.latitude &&
          place.longitude && (
            <Marker
              key={i}
              coordinate={{
                latitude: Number(place.latitude),
                longitude: Number(place.longitude),
              }}
              pinColor="#2E7D32"
            >
              <Callout
                tooltip={true}
                onPress={() => navigation.navigate('ItemScreen', { param: place })}
              >
                <View
                  style={{ width: 200, padding: 5 }}
                  className={`px-4 py-4 rounded-xl ${
                    darkMode ? 'bg-neutral-900' : 'bg-neutral-100'
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      largeText ? 'text-2xl' : 'text-lg'
                    } ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}
                  >
                    {place?.name}
                  </Text>
                  <Text
                    numberOfLines={2}
                    className={`mb-4 ${
                      largeText ? 'text-xl' : 'text-md'
                    } ${darkMode ? 'text-neutral-300' : 'text-neutral-900'}`}
                  >
                    {place?.address || place?.location_string}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#2E7D32',
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('ItemScreen', { param: place })}
                  >
                    <Text
                      style={{ color: 'white', fontWeight: 'bold' }}
                      className={`text-neutral-100 font-bold ${
                        largeText ? 'text-xl' : 'text-md'
                      }`}
                    >
                      Show Item →
                    </Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          )
        ))}
      </MapView>

      {/* Type selector */}
      <View
        style={styles.typeSelectorContainer}
        className=""
      >
        {['restaurants', 'attractions', 'hotels'].map(type => {
          const isActive = placeType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setPlaceType(type)}
              activeOpacity={0.8}
              className={`px-3 py-1 rounded-full mx-1 ${
                isActive
                  ? 'bg-green-800'
                  : darkMode
                    ? 'bg-neutral-800'
                    : 'bg-white'
              }`}
              style={{
                borderWidth: isActive ? 0 : 1,
                borderColor: darkMode ? '#4b5563' : '#e5e7eb',
              }}
            >
              <Text
                className={`${
                  largeText ? 'text-2xl' : 'text-lg'
                } font-semibold ${
                  isActive
                    ? 'text-slate-100'
                    : darkMode
                      ? 'text-slate-100'
                      : 'text-gray-900'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoadingPlaces && (
        <View
          style={[
            styles.overlayCenter,
            {
              backgroundColor: darkMode
                ? 'rgba(15,23,42,0.7)' // slate-900 with opacity
                : 'rgba(248,250,252,0.7)', // slate-50 with opacity
            },
          ]}
        >
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text
            className={`mt-3 ${
              largeText ? 'text-2xl' : 'text-lg'
            } ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}
          >
            Loading locations...
          </Text>
        </View>
      )}
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
  typeSelectorContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  overlayCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
