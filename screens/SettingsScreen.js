import { View, Text, Switch } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const { darkMode, toggleTheme, largeText, toggleLargeText } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-3xl font-semibold text-pink-600">
          Settings
        </Text>
      </View>

      <View className="mt-10 px-6">
        <View className="flex-row justify-between items-center">
          <Text className={`flex-1 ${largeText ? 'text-2xl' : 'text-lg'} ${darkMode ? "text-white" : "text-black"}`}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '', true: '#D81B60' }}
          />
        </View>
      </View>
      <View className="mt-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className={`${largeText ? 'text-2xl' : 'text-lg'} ${darkMode ? 'text-white' : 'text-black'}`}>
            Large Text
          </Text>
          <Switch
            value={largeText}
            onValueChange={toggleLargeText}
            trackColor={{ false: '', true: '#D81B60' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
