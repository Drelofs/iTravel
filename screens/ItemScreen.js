import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/buttons/BackButton';
import SaveButton from '../components/buttons/SaveButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;

const ItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;
  const insets = useSafeAreaInsets();

  const { darkMode, largeText } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>

      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* IMAGE */}
      <View className="absolute top-0 left-0 right-0" style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={{
            uri: data?.photo?.images?.large?.url
              ? data?.photo?.images?.large?.url
              : 'https://static.thenounproject.com/png/2932881-200.png',
          }}
          className="w-full h-full object-cover"
        />
      </View>

      {/* TOP ICONS */}
      <SafeAreaView className="absolute inset-x-0 top-0 z-10 px-6 flex-row justify-between">
        <BackButton
          onPress={() => navigation.goBack()}
          icon="chevron-left"
          size={48}
          iconSize={24}
          darkMode={darkMode}
        />

        <SaveButton
          locationData={data}
          size={48}
          iconSize={24}
          darkMode={darkMode}
          color="#D81B60"
        />

      </SafeAreaView>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: IMAGE_HEIGHT - insets.top }}
      >
        <View className="mt-2">
          <Text className={`text-pink-600 ${largeText ? 'text-4xl' : 'text-2xl'} font-bold`}>{data?.name}</Text>

          <View className="flex-row items-center gap-2 mt-2">
            <FontAwesome name="map-marker" size={25} color="#FF0000" />
            <Text className={`text-pink-300 ${largeText ? 'text-2xl' : 'text-lg'} font-bold`}>{data?.location_string}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          {data?.rating && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                <FontAwesome name="star" size={24} color="#D81B60" />
              </View>
              <View>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.rating}</Text>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>Ratings</Text>
              </View>
            </View>
          )}

          {data?.price_level && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                <MaterialIcons name="attach-money" size={24} color="#D81B60" />
              </View>
              <View>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.price_level}</Text>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>Price Level</Text>
              </View>
            </View>
          )}

          {data?.bearing && (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                <FontAwesome5 name="map-signs" size={24} color="#D81B60" />
              </View>
              <View>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"} capitalize`}>{data?.bearing}</Text>
                <Text className={`${darkMode ? "text-slate-100" : "text-gray-900"}`}>Bearing</Text>
              </View>
            </View>
          )}
        </View>

        {data?.description && (
          <Text className={`my-4 tracking-wide ${largeText ? 'text-2xl' : 'text-md'} ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
            {data?.description}
          </Text>
        )}

        {data?.cuisine && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {data?.cuisine.map((n) => (
              <TouchableOpacity key={n.key} className="px-2 py-1 rounded-md bg-pink-600">
                <Text className={`text-slate-100 ${largeText ? 'text-2xl' : 'text-md'}`}>{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className={`gap-y-2 mt-4 ${darkMode ? "bg-neutral-800" : "bg-gray-200"} rounded-2xl px-4 py-4 overflow-hidden`}>
          {data?.phone && (
            <View className="items-center flex-row gap-x-8">
              <FontAwesome name="phone" size={24} color="#D81B60" />
              <Text className={`${largeText ? 'text-xl' : 'text-sm'} ${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.phone}</Text>
            </View>
          )}
          {data?.email && (
            <View className="items-center flex-row gap-x-8">
              <FontAwesome name="envelope" size={24} color="#D81B60" />
              <Text className={`${largeText ? 'text-xl' : 'text-sm'} ${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.email}</Text>
            </View>
          )}
          {data?.address && (
            <View className="items-center flex-row gap-x-8">
              <FontAwesome name="map-pin" size={24} color="#D81B60" />
              <Text className={`${largeText ? 'text-xl' : 'text-sm'} ${darkMode ? "text-slate-100" : "text-gray-900"}`}>{data?.address}</Text>
            </View>
          )}
        </View>

        <View className="mt-4 px-4 py-4 rounded-lg bg-pink-600 items-center justify-center mb-12">
          <TouchableOpacity
            className="w-full items-center"
            onPress={() =>
              navigation.navigate('ItemLocationScreen', {
                poiLocation: {
                  latitude: Number(data.latitude),
                  longitude: Number(data.longitude),
                },
                poiName: data.name,
              })
            }
          >
            <Text className={`${largeText ? 'text-3xl' : 'text-xl'} font-semibold tracking-wider text-gray-100`}>
              Show Location on Map
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;
