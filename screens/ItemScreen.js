import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

const ItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;

  const { darkMode, toggleTheme } = useTheme();
  const [isSaved, setIsSaved] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const existing = await AsyncStorage.getItem('savedLocations');
        const saved = existing ? JSON.parse(existing) : [];
        const alreadySaved = saved.some(
          loc => loc.name === data.name && loc.location_string === data.location_string
        );
        setIsSaved(alreadySaved);
      } catch (e) {
        console.error('Error checking saved location:', e);
      }
    };

    checkIfSaved();
  }, []);

  const toggleSaveLocation = async (locationData) => {
    try {
      const existing = await AsyncStorage.getItem('savedLocations');
      const saved = existing ? JSON.parse(existing) : [];

      const index = saved.findIndex(
        loc => loc.name === locationData.name && loc.location_string === locationData.location_string
      );

      if (index !== -1) {
        const updated = [...saved];
        updated.splice(index, 1);
        await AsyncStorage.setItem('savedLocations', JSON.stringify(updated));
        setIsSaved(false);
      } else {
        const updated = [...saved, locationData];
        await AsyncStorage.setItem('savedLocations', JSON.stringify(updated));
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Failed to toggle save location:', e);
      alert('Something went wrong.');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-neutral-100"} relative`}>
      <ScrollView className="flex-1 px-4 py-6">
        <View className="relative shadow-lg">
          <Image
            source={{
              uri: data?.photo?.images?.large?.url
                ? data?.photo?.images?.large?.url
                : 'https://static.thenounproject.com/png/2932881-200.png',
            }}
            className="w-full h-72 object-cover rounded-2xl"
          />
          <View className="absolute flex-row inset-x-0 top-5 justify-between px-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className={`w-10 h-10 rounded-md items-center justify-center ${darkMode? "bg-neutral-900" : "bg-white"}`}>
              <FontAwesome5 name="chevron-left" size={24} color="#D81B60" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSaveLocation(data)} className={`w-10 h-10 rounded-md items-center justify-center ${darkMode? "bg-neutral-900" : "bg-white"}`}>
              {isSaved ? (
                <Octicons name="heart-fill" size={24} color="#D81B60" />
              ) : (
                <Octicons name="heart" size={24} color="#D81B60" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-pink-600 text-[24px] font-bold">{data?.name}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <FontAwesome name="map-marker" size={25} color="#FF0000" />
            <Text className="text-pink-300 text-[20px] font-bold">{data?.location_string}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          {data?.rating && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                <FontAwesome name="star" size={24} color="#D81B60" />
              </View>
              <View>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.rating}</Text>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>Ratings</Text>
              </View>
            </View>
          )}

          {data?.price_level && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                <MaterialIcons name="attach-money" size={24} color="#D81B60" />
              </View>
              <View>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.price_level}</Text>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>Price Level</Text>
              </View>
            </View>
          )}

          {data?.bearing && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                <FontAwesome5 name="map-signs" size={24} color="#D81B60" />
              </View>
              <View>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"} capitalize`}>{data?.bearing}</Text>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>Bearing</Text>
              </View>
            </View>
          )}
        </View>

        {data?.description && (
          <Text className={`my-4 tracking-wide text-[16px] ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
            {data?.description}
          </Text>
        )}

        {data?.cuisine && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {data?.cuisine.map((n) => (
              <TouchableOpacity key={n.key} className="px-2 py-1 rounded-md bg-pink-600">
                <Text className="text-slate-100">{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className={`gap-y-2 mt-4 ${darkMode ? "bg-neutral-800" : "bg-gray-200"} rounded-2xl px-4 py-4 overflow-hidden`}>
          {data?.phone && (
            <View className="items-center flex-row gap-x-8">
              <FontAwesome name="phone" size={24} color="#D81B60" />
              <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.phone}</Text>
            </View>
          )}
          {data?.email && (
            <View className="items-center flex-row gap-x-8">
              <FontAwesome name="envelope" size={24} color="#D81B60" />
              <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.email}</Text>
            </View>
          )}
          {data?.address && (
            <View className="items-center flex-row gap-x-8">
              <FontAwesome name="map-pin" size={24} color="#D81B60" />
              <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.address}</Text>
            </View>
          )}
        </View>

        <View className="mt-4 px-4 py-4 rounded-lg bg-pink-600 items-center justify-center mb-12">
          <TouchableOpacity
            className="w-full items-center"
            onPress={() =>
              navigation.navigate('ItemLocationScreen', {
                poiLocation: {
                  latitude: Number(data.latitude),
                  longitude: Number(data.longitude),
                },
                poiName: data.name,
              })
            }
          >
            <Text className="text-xl font-semibold tracking-wider text-gray-100">
              Show Location on Map
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;
