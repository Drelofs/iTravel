import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;

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
        alert('Location removed from saved.');
      } else {
        const updated = [...saved, locationData];
        await AsyncStorage.setItem('savedLocations', JSON.stringify(updated));
        setIsSaved(true);
        alert('Location saved!');
      }
    } catch (e) {
      console.error('Failed to toggle save location:', e);
      alert('Something went wrong.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="relative bg-white shadow-lg">
          <Image
            source={{
              uri: data?.photo?.images?.large?.url
                ? data?.photo?.images?.large?.url
                : 'https://static.thenounproject.com/png/2932881-200.png',
            }}
            className="w-full h-72 object-cover rounded-2xl"
          />
          <View className="absolute flex-row inset-x-0 top-5 justify-between px-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-md items-center justify-center bg-white">
              <FontAwesome5 name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSaveLocation(data)} className="w-10 h-10 rounded-md items-center justify-center bg-white">
              {isSaved ? (
                <Octicons name="heart-fill" size={24} color="#06B2BE" />
              ) : (
                <Octicons name="heart" size={24} color="#06B2BE" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-[#428288] text-[24px] font-bold">{data?.name}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <FontAwesome name="map-marker" size={25} color="#06B2BE" />
            <Text className="text-[#8C9EA6] text-[20px] font-bold">{data?.location_string}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          {data?.rating && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-red-100 items-center justify-center shadow-md">
                <FontAwesome name="star" size={24} color="#D58574" />
              </View>
              <View>
                <Text className="text-[#515151]">{data?.rating}</Text>
                <Text className="text-[#515151]">Ratings</Text>
              </View>
            </View>
          )}

          {data?.price_level && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-red-100 items-center justify-center shadow-md">
                <MaterialIcons name="attach-money" size={24} color="black" />
              </View>
              <View>
                <Text className="text-[#515151]">{data?.price_level}</Text>
                <Text className="text-[#515151]">Price Level</Text>
              </View>
            </View>
          )}

          {data?.bearing && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-red-100 items-center justify-center shadow-md">
                <FontAwesome5 name="map-signs" size={24} color="black" />
              </View>
              <View>
                <Text className="text-[#515151] capitalize">{data?.bearing}</Text>
                <Text className="text-[#515151]">Bearing</Text>
              </View>
            </View>
          )}
        </View>

        {data?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-semibold text-[#97A6AF]">
            {data?.description}
          </Text>
        )}

        {data?.cuisine && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {data?.cuisine.map((n) => (
              <TouchableOpacity key={n.key} className="px-2 py-1 rounded-md bg-emerald-100">
                <Text>{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="gap-y-2 mt-4 bg-gray-100 rounded-2xl px-4 py-2">
          {data?.phone && (
            <View className="items-center flex-row gap-x-6">
              <FontAwesome name="phone" size={24} color="#428288" />
              <Text className="text-lg">{data?.phone}</Text>
            </View>
          )}
          {data?.email && (
            <View className="items-center flex-row gap-x-6">
              <FontAwesome name="envelope" size={24} color="#428288" />
              <Text className="text-lg">{data?.email}</Text>
            </View>
          )}
          {data?.address && (
            <View className="items-center flex-row gap-x-6">
              <FontAwesome name="map-pin" size={24} color="#428288" />
              <Text className="text-lg">{data?.address}</Text>
            </View>
          )}
        </View>

        <View className="mt-4 px-4 py-4 rounded-lg bg-[#06B2BE] items-center justify-center mb-12">
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
            <Text className="text-3xl font-semibold uppercase tracking-wider text-gray-100">
              Show on Map
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;
