import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemCardContainer from '../components/ItemCardContainer';
import { useFocusEffect } from '@react-navigation/native';

const SavedScreen = () => {
  const [savedLocations, setSavedLocations] = useState([]);

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
    <SafeAreaView className="flex-1 bg-white relative">
      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-2xl font-semibold text-[#06B2BE]">
          Saved Locations
        </Text>
      </View>
      <ScrollView className="p-4 bg-white">
        {savedLocations.length === 0 ? (
          <View className="h-80 w-full flex-1 items-center justify-center">
            <Text>There are no saved locations.</Text>
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
