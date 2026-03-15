import { View, Text, TouchableOpacity, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import SaveButton from './buttons/SaveButton';

const ItemCardContainer = ({ image, title, location, data, onSavedChange }) => {
  const navigation = useNavigation();
  const { darkMode, largeText } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ItemScreen', { param: data })}
      className={`gap-2 rounded-3xl ${
        darkMode ? 'bg-neutral-800' : 'bg-white border border-slate-50'
      } w-full overflow-hidden my-2`}
    >
      {/* Image + save icon */}
      <View className="relative w-full h-60">
        <Image source={{ uri: image }} className="w-full h-60 object-cover" />

        <View className="absolute top-3 right-3">
          <SaveButton
            locationData={data}
            size={40}
            iconSize={20}
            darkMode={darkMode}
            color="#2E7D32"
            onSavedChange={onSavedChange}
          />
        </View>
      </View>

      {title ? (
        <View className="px-4 pb-4 pt-2">
          <Text
            className={`font-chillaxsemibold ${largeText ? 'text-4xl' : 'text-3xl'} ${
              darkMode ? 'text-slate-100' : 'text-gray-900'
            } font-bold mb-2`}
          >
            {title?.length > 28 ? `${title.slice(0, 28)}...` : title}
          </Text>

          <View className="flex-row items-center gap-1">
            <FontAwesome name="map-marker" size={20} color="#2E7D32" />
            <Text
              className={`${largeText ? 'text-xl' : 'text-md'} text-gray-500 font-bold`}
            >
              {data?.address_obj?.city} - {data?.address_obj?.country}
            </Text>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default ItemCardContainer