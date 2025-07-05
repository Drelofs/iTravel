import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemCardContainer from '../components/ItemCardContainer';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

const SavedScreen = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const { darkMode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const loadSaved = async () => {
        const data = await AsyncStorage.getItem('savedLocations');
        setSavedLocations(data ? JSON.parse(data) : []);
      };

      loadSaved();
    }, [])
  );

  return (
    <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-neutral-100"} relative`}>
      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-3xl font-semibold text-pink-600">
          Saved Locations
        </Text>
      </View>
      <ScrollView className="p-4">
        {savedLocations.length === 0 ? (
          <View className="h-80 w-full flex-1 items-center justify-center">
            <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"} text-xl`}>You haven't saved any locations yet.</Text>
          </View>      
        ) : (
          savedLocations.map((loc, i) => (
            <ItemCardContainer
              key={i}
              image={loc?.photo?.images?.medium?.url ?? 'https://static.thenounproject.com/png/2932881-200.png'}
              title={loc?.name}
              location={loc?.location_string}
              data={loc}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedScreen;
