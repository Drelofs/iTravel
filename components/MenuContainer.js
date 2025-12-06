import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MenuContainer = ({ title, imageSrc, type, setType }) => {
  const { darkMode, largeText } = useTheme();

  const handlePress = () => {
    setType(title.toLowerCase());
  };

  // Determine if this menu is selected
  const isSelected = type === title.toLowerCase();

  // Determine text and icon color
  const textColor = isSelected ? 'text-slate-100' : darkMode ? 'text-slate-100' : 'text-gray-900';
  const iconColor = isSelected ? '#fff' : darkMode ? '#fff' : '#111';

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className={`
        flex-row items-center gap-x-2 py-2 px-4 rounded-full
        ${isSelected ? 'bg-pink-600' : ''}
      `}>
        <MaterialIcons name="attractions" size={24} color={iconColor} />
        <Text className={`${largeText ? 'text-2xl' : 'text-lg'} ${textColor}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MenuContainer;
