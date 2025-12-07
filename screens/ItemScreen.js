import { 
  View, 
  Text,
  TouchableOpacity, 
  StatusBar, 
  Dimensions, 
  Animated 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useLayoutEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/buttons/BackButton';
import SaveButton from '../components/buttons/SaveButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;

const OVERLAP_HEIGHT = 30;
const CONTENT_MARGIN_TOP = IMAGE_HEIGHT - OVERLAP_HEIGHT;

const ItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;
  const insets = useSafeAreaInsets();

  const { darkMode, largeText } = useTheme();
  const contentBgColor = darkMode ? 'bg-neutral-900' : 'bg-neutral-100';

  const scrollY = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const imageScale = scrollY.interpolate({
    inputRange: [-200, 0], 
    outputRange: [1.5, 1], 
    extrapolateRight: 'clamp',
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. IMAGE: Absolutely positioned and Animated.Image */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <Animated.Image 
          source={{
            uri: data?.photo?.images?.large?.url
              ? data?.photo?.images?.large?.url
              : 'https://static.thenounproject.com/png/2932881-200.png',
          }}
          style={{ 
            width: '100%', 
            height: IMAGE_HEIGHT,
            transform: [{ scale: imageScale }],
          }}
          className="object-cover"
        />
      </View>

      {/* 2. TOP ICONS */}
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
          color="#2E7D32"
        />
      </SafeAreaView>

      {/* 3. SCROLLVIEW: Enabled for bounce/overscroll */}
      <Animated.ScrollView 
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        bounces={true} // <-- Enables pull-down effect on iOS
        overScrollMode={'always'} // <-- Enables pull-down effect on Android
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true } 
        )}
        scrollEventThrottle={16} 
      >
        {/* 4. CONTENT CONTAINER */}
        <View
          style={{ marginTop: CONTENT_MARGIN_TOP }}
          className={`px-4 flex-1 ${contentBgColor} rounded-t-[30px]`}
        >
            {/* SCROLL INDICATOR STRIPE */}
            <View className="w-full items-center py-4">
                <View className="w-10 h-1 rounded-full bg-gray-400"></View>
            </View>
          
          {/* NAME & LOCATION */}
          <View className="mt-2 px-4">
            <Text className={`font-chillaxregular text-gray-900 ${largeText ? 'text-6xl' : 'text-4xl'} font-bold`}>
              {data?.name}
            </Text>

            <View className="flex-row items-center gap-2 mt-2">
              <FontAwesome name="map-marker" size={25} color="#FF0000" />
              <Text className={`text-green-800 ${largeText ? 'text-2xl' : 'text-lg'} font-bold`}>
                {data?.address_obj?.city}
              </Text>
            </View>
          </View>

          {/* RATING, PRICE, BEARING */}
          <View className="mt-4 flex-row items-center justify-between px-4">
            {data?.rating && (
              <View className="flex-row items-center gap-2">
                <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                  <FontAwesome name="star" size={24} color="#D81B60" />
                </View>
                <View>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{data?.rating}</Text>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Ratings</Text>
                </View>
              </View>
            )}

            {data?.price_level && (
              <View className="flex-row items-center gap-2">
                <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                  <MaterialIcons name="attach-money" size={24} color="#D81B60" />
                </View>
                <View>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{data?.price_level}</Text>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Price Level</Text>
                </View>
              </View>
            )}

            {data?.bearing && (
              <View className="flex-row items-center gap-2">
                <View className="w-12 h-12 rounded-2xl bg-pink-300 items-center justify-center shadow-md">
                  <FontAwesome5 name="map-signs" size={24} color="#D81B60" />
                </View>
                <View>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'} capitalize`}>{data?.bearing}</Text>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>Bearing</Text>
                </View>
              </View>
            )}
          </View>

          {/* DESCRIPTION */}
          {data?.description && (
            <Text
              className={`my-4 tracking-wide ${largeText ? 'text-2xl' : 'text-md'} ${
                darkMode ? 'text-slate-100' : 'text-gray-900'
              } px-4`}
            >
              {data?.description}
            </Text>
          )}

          {/* CUISINE TAGS */}
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4 px-4">
            {data?.cuisine?.map((n) => (
              <TouchableOpacity key={n.key} className="px-2 py-1 rounded-md bg-pink-600">
                <Text className={`text-slate-100 ${largeText ? 'text-2xl' : 'text-md'}`}>{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CONTACT INFO */}
          <View
            className={`gap-y-2 mt-4 ${darkMode ? 'bg-neutral-800' : 'bg-gray-200'} rounded-2xl mx-4 px-4 py-4 overflow-hidden`}
          >
            {data?.phone && (
              <View className="items-center flex-row gap-x-8">
                <FontAwesome name="phone" size={24} color="#D81B60" />
                <Text className={`${largeText ? 'text-xl' : 'text-sm'} ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  {data?.phone}
                </Text>
              </View>
            )}
            {data?.email && (
              <View className="items-center flex-row gap-x-8">
                <FontAwesome name="envelope" size={24} color="#D81B60" />
                <Text className={`${largeText ? 'text-xl' : 'text-sm'} ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  {data?.email}
                </Text>
              </View>
            )}
            {data?.address && (
              <View className="items-center flex-row gap-x-8">
                <FontAwesome name="map-pin" size={24} color="#D81B60" />
                <Text className={`${largeText ? 'text-xl' : 'text-sm'} ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  {data?.address}
                </Text>
              </View>
            )}
          </View>

          {/* SHOW LOCATION BUTTON */}
          <View className="mt-4 px-4 py-4 rounded-lg bg-pink-600 items-center justify-center mb-12 mx-4">
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
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ItemScreen;