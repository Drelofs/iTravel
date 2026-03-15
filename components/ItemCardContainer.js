import { View, Text, TouchableOpacity, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import SaveButton from './buttons/SaveButton';
import { LinearGradient } from 'expo-linear-gradient';

const ItemCardContainer = ({ image, title, location, data, onSavedChange }) => {
  const navigation = useNavigation();
  const { darkMode, largeText } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ItemScreen', { param: data })}
      className={`gap-1 rounded-3xl ${
        darkMode ? 'bg-neutral-800' : 'bg-white border border-slate-50'
      } w-full overflow-hidden my-2`}
    >
      <View className="relative w-full h-80">
        <Image source={{ uri: image }} className="w-full h-full object-cover" />

        {/* Bottom gradient overlay for text readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 140,
          }}
        />
        <View className="absolute top-3 right-3 z-30">
          <SaveButton
            locationData={data}
            size={40}
            iconSize={20}
            darkMode={darkMode}
            color="#2E7D32"
            onSavedChange={onSavedChange}
          />
        </View>
        {title ? (
          <View className="absolute bottom-4 px-4 pt-2 z-20">
            <Text
              className={`font-chillaxsemibold ${
                largeText ? 'text-4xl' : 'text-3xl'
              } text-slate-100 font-bold mb-2`}
            >
              {title?.length > 28 ? `${title.slice(0, 28)}...` : title}
            </Text>

            <View className="flex-row items-center gap-1">
              <FontAwesome name="map-marker" size={20} color="#F1F5F9" />
              <Text
                className={`${largeText ? 'text-xl' : 'text-md'} text-slate-100 font-bold`}
              >
                {data?.address_obj?.city} - {data?.address_obj?.country}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default ItemCardContainer