import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView
      className={`${
        savedLocations.length === 0 ? 'flex-1' : ''
      } ${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'} relative`}
    >
      <View className="flex-row justify-center items-center my-4">
        <Text className="text-3xl font-semibold text-green-800">Saved Locations</Text>
      </View>

      {savedLocations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text
            className={`${
              darkMode ? 'text-slate-100' : 'text-gray-900'
            } text-xl text-center`}
          >
            You haven't saved any locations yet.
          </Text>
        </View>
      ) : (
        <ScrollView className="px-4">
          {savedLocations.map((loc, i) => (
            <ItemCardContainer
              key={i}
              image={
                loc?.photo?.images?.medium?.url ??
                'https://static.thenounproject.com/png/2932881-200.png'
              }
              title={loc?.name}
              location={loc?.location_string}
              data={loc}
              onSavedChange={(isSavedNow, location) => {
                if (!isSavedNow) {
                  setSavedLocations(prev =>
                    prev.filter(
                      l =>
                        !(
                          l.name === location.name &&
                          l.location_string === location.location_string
                        )
                    )
                  );
                }
              }}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SavedScreen;
