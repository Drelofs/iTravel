import { View, Text, Switch } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-3xl font-semibold text-pink-600">
          Settings
        </Text>
      </View>

      <View className="mt-10 px-6">
        <View className="flex-row justify-between items-center">
          <Text className={`flex-1 text-xl ${darkMode ? "text-white" : "text-black"}`}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
