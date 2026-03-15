import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/buttons/BackButton';
import SaveButton from '../components/buttons/SaveButton';
import { Linking } from 'react-native';

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

  const scrollY = useSharedValue(0);
  const maxScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      'worklet';
      const y = e.contentOffset.y;
      scrollY.value = y;
      if (y > maxScrollY.value) {
        maxScrollY.value = y;
      }
    },
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    'worklet';

    // Only zoom/stretch when pulling the ScrollView DOWN (negative scroll).
    // When scrolling UP (content moving up, y >= 0), keep the image at its base size.
    const scale = interpolate(
      scrollY.value,
      [-300, 0],   // pull a bit further for stronger effect
      [2.5, 1],    // increase max zoom so background stays covered
      Extrapolation.CLAMP
    );

    return { transform: [{ scale }] };
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // console.log(data);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. IMAGE: scale driven by scroll via Reanimated */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <Animated.Image
          source={{
            uri: data?.photo?.images?.large?.url
              ? data?.photo?.images?.large?.url
              : 'https://static.thenounproject.com/png/2932881-200.png',
          }}
          resizeMode="cover"
          style={[
            { width: '100%', height: IMAGE_HEIGHT },
            animatedImageStyle,
          ]}
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

      {/* 3. SCROLLVIEW: scroll position drives image scale (Reanimated) */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        bounces={true}
        overScrollMode="always"
        onScroll={scrollHandler}
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
            <Text className={`font-chillaxsemibold text-gray-900 ${largeText ? 'text-6xl' : 'text-4xl'} font-bold`}>
              {data?.name}
            </Text>

            <View className="flex-row items-center gap-2 mt-2">
              <FontAwesome name="map-marker" size={25} color="#2E7D32" />
              <Text className={`text-gray-500 ${largeText ? 'text-2xl' : 'text-lg'} font-bold`}>
                {data?.address_obj?.city} - {data?.address_obj?.country}
              </Text>
            </View>
          </View>

          {/* RATING, PRICE, BEARING */}
          <View className="mt-4 flex-row items-center justify-between px-4">
            {data?.rating && (
              <View className="flex-row items-center gap-2">
                <View className="w-12 h-12 rounded-2xl border border-1 border-green-800 items-center justify-center shadow-md">
                  <FontAwesome name="star" size={24} color="#2E7D32" />
                </View>
                <View>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-700'} font-bold`}>Ratings</Text>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{data?.rating}/5</Text>
                </View>
              </View>
            )}

            {data?.distance && (
              <View className="flex-row items-center gap-2">
                <View className="w-12 h-12 rounded-2xl border border-1 border-green-800 items-center justify-center shadow-md">
                  <FontAwesome name="location-arrow" size={24} color="#2E7D32" />
                </View>
                <View>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'} font-bold`}>Distance</Text>
                  <Text className={`${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{data?.distance_string}</Text>
                </View>
              </View>
            )}

            {data?.latitude && data?.longitude && (
              <View>
                <TouchableOpacity 
                  className="flex-row items-center gap-2"
                  onPress={() =>
                    navigation.navigate('ItemLocationScreen', {
                      poiLocation: {
                        latitude: Number(data.latitude),
                        longitude: Number(data.longitude),
                      },
                      poiName: data.name,
                    })
                }>
                  <View className="w-12 h-12 rounded-2xl border border-1 border-green-800 items-center justify-center shadow-md">
                    <FontAwesome name="map-marker" size={24} color="#2E7D32" />
                  </View>
                  <View>
                    <Text className={`text-green-800 font-bold`}>Show{'\n'}on Map</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* DESCRIPTION */}
          {data?.description && (
            <>
              <Text className="text-2xl font-bold font-chillaxsemibold px-4 mt-4">Description</Text>
              <Text
                className={`mb-4 tracking-wide ${largeText ? 'text-2xl' : 'text-md'} ${
                  darkMode ? 'text-slate-100' : 'text-gray-900'
                } px-4`}
              >
                {data?.description}
              </Text>
            </>
          )}

          {/* CUISINE TAGS */}
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4 px-4">
            {data?.cuisine?.map((n) => (
              <TouchableOpacity key={n.key} className="px-2 py-1 rounded-md bg-green-800">
                <Text className={`text-slate-100 ${largeText ? 'text-2xl' : 'text-md'}`}>{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CONTACT INFO */}
          <View
            className={`gap-y-3 px-4 pt-4 overflow-hidden`}
          >
            {(data?.phone || data?.email || data?.address) && (
              <View className="items-center flex-row gap-x-8">
                <Text
                  className={`tracking-wide font-bold font-chillaxsemibold text-2xl ${
                    darkMode ? 'text-slate-100' : 'text-gray-900'
                  }`}
                >
                  Contact Info
                </Text>
              </View>
            )}
            {data?.phone && (
              <View className="items-center flex-row">
                <TouchableOpacity className="flex-row items-center gap-x-8" onPress={() => Linking.openURL(`tel:${data?.phone}`)}>
                  <MaterialIcons className="w-8" name="phone" size={24} color="#2E7D32" />
                  <Text className={`text-green-800 underline ${largeText ? 'text-xl' : 'text-lg'} ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                    {data?.phone}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {data?.email && (
              <View className="items-center flex-row">
                <TouchableOpacity className="flex-row items-center gap-x-8" onPress={() => Linking.openURL(`mailto:${data?.email}`)}>
                  <MaterialIcons className="w-8" name="email" size={24} color="#2E7D32" />
                  <Text className={`text-green-800 underline ${largeText ? 'text-xl' : 'text-lg'} ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                    {data?.email}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {data?.address && (
              <View className="items-center flex-row gap-x-8">
                <MaterialIcons className="w-8" name="location-pin" size={24} color="#2E7D32" />
                <Text className={`${largeText ? 'text-xl' : 'text-lg'} ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  {data?.address}
                </Text>
              </View>
            )}
          </View>

          {/* SHOW LOCATION BUTTON */}
          {/* <View className="mt-4 px-4 py-4 rounded-lg bg-pink-600 items-center justify-center mb-12 mx-4">
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
          </View> */}

          {/* Booking Button */}
          <View className="mt-4 px-4 py-4 rounded-3xl bg-green-800 items-center justify-center mb-12 mx-4">
            <TouchableOpacity className="flex flex-row w-full items-cente justify-center gap-x-3" onPress={() => Linking.openURL(data?.booking.url)}>
              <Text className={`text-slate-100 ${largeText ? 'text-2xl' : 'text-xl'} font-bold`}>
                Book now
              </Text>
              <MaterialIcons className="w-8" name="open-in-new" size={24} color="#ffffff"/>
            </TouchableOpacity>
          </View>

        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ItemScreen;