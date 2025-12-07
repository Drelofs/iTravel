import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MenuContainer = ({ title, imageSrc, iconName, type, setType }) => {
  const { darkMode, largeText } = useTheme();

  const handlePress = () => {
    setType(title.toLowerCase());
  };

  const isSelected = type === title.toLowerCase();

  // ✅ Text & icon color logic
  const textColor = isSelected
    ? 'text-slate-100'
    : darkMode
      ? 'text-slate-100'
      : 'text-gray-900';

  const iconColor = isSelected
    ? '#fff'
    : darkMode
      ? '#fff'
      : '#374151'; // gray-700

  // ✅ Background logic: pink when active, grey when inactive
  const backgroundColor = isSelected
    ? 'bg-pink-600'
    : darkMode
      ? 'bg-neutral-700'
      : 'bg-gray-200';

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        className={`
          flex-row items-center gap-x-2 py-2 px-4 rounded-full
          ${backgroundColor}
        `}
      >
        <MaterialIcons name={iconName} size={24} color={iconColor} />
        <Text className={`${largeText ? 'text-xl' : 'text-md'} ${textColor}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MenuContainer;
