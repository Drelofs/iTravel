import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from '@expo/vector-icons/Octicons';

const SaveButton = ({
  locationData,
  size = 48,
  iconSize = 24,
  darkMode = false,
  color,
  onSavedChange, // optional callback: (isSavedNow, locationData) => void
}) => {
  const [isSaved, setIsSaved] = useState(false);

  // Check if this location is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const existing = await AsyncStorage.getItem('savedLocations');
        const saved = existing ? JSON.parse(existing) : [];
        const alreadySaved = saved.some(
          loc =>
            loc.name === locationData.name &&
            loc.location_string === locationData.location_string
        );
        setIsSaved(alreadySaved);
      } catch (e) {
        console.error('Error checking saved location:', e);
      }
    };
    checkIfSaved();
  }, [locationData]);

  // Internal helpers for save/unsave
  const performUnsave = async () => {
    const existing = await AsyncStorage.getItem('savedLocations');
    const saved = existing ? JSON.parse(existing) : [];

    const index = saved.findIndex(
      loc =>
        loc.name === locationData.name &&
        loc.location_string === locationData.location_string
    );

    if (index === -1) return;

    const updated = [...saved];
    updated.splice(index, 1);
    await AsyncStorage.setItem('savedLocations', JSON.stringify(updated));
    setIsSaved(false);
    if (onSavedChange) {
      onSavedChange(false, locationData);
    }
  };

  const performSave = async () => {
    const existing = await AsyncStorage.getItem('savedLocations');
    const saved = existing ? JSON.parse(existing) : [];

    const alreadySaved = saved.some(
      loc =>
        loc.name === locationData.name &&
        loc.location_string === locationData.location_string
    );

    if (alreadySaved) return;

    const updated = [...saved, locationData];
    await AsyncStorage.setItem('savedLocations', JSON.stringify(updated));
    setIsSaved(true);
    if (onSavedChange) {
      onSavedChange(true, locationData);
    }
  };

  // Toggle save/unsave with confirmation on unsave
  const toggleSave = async () => {
    try {
      if (isSaved) {
        Alert.alert(
          'Remove saved place',
          'Are you sure you want to remove this from your saved list?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                // run asynchronously, but we don't need to await here
                performUnsave().catch(err => {
                  console.error('Failed to remove saved location:', err);
                  Alert.alert('Something went wrong.');
                });
              },
            },
          ]
        );
      } else {
        await performSave();
      }
    } catch (e) {
      console.error('Failed to toggle save location:', e);
      Alert.alert('Something went wrong.');
    }
  };

  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8, // Android shadow
      }}
      className="rounded-full"
    >
      <TouchableOpacity
        onPress={toggleSave}
        activeOpacity={1}
        className={`rounded-full items-center justify-center ${
          darkMode ? 'bg-neutral-900' : 'bg-white'
        }`}
        style={{
          width: size,
          height: size,
        }}
      >
        {isSaved ? (
          <Octicons name="heart-fill" size={iconSize} color={color} />
        ) : (
          <Octicons name="heart" size={iconSize} color={color} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SaveButton;
