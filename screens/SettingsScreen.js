import { View, Text, Switch } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView className={darkMode ? "flex-1 bg-black" : "flex-1 bg-white"}>
      <View className="flex-row justify-center items-center mt-4">
        <Text className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
          Settings
        </Text>
      </View>

      <View className="mt-10 px-6">
        <View className="flex-row justify-between items-center">
          <Text className={darkMode ? "flex-1 text-white" : "flex-1 text-black"}>Dark Mode</Text>
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
