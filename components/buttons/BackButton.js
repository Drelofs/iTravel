import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const BackButton = ({
  onPress,
  icon = 'chevron-left',
  size = 12,
  iconSize = 24,
  darkMode = false,
  iconColorLight = '#2E7D32',
  iconColorDark = '#fff',
}) => {
  const containerSize = size;

  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8, // Android
      }}
      className="rounded-full"
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={`rounded-full justify-center items-center ${
          darkMode ? 'bg-black' : 'bg-white'
        }`}
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        <FontAwesome5
          name={icon}
          size={iconSize}
          color={darkMode ? iconColorDark : iconColorLight}
          style={{
            textShadowColor: 'rgba(0,0,0,0.25)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
