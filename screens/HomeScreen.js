import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Hotels, Attractions, Restaurants } from '../assets';
import MenuContainer from '../components/MenuContainer';
import ItemCardContainer from '../components/ItemCardContainer';
import { useTheme } from '../contexts/ThemeContext';
import { getPlacesData } from '../api';
import SearchAutocomplete from '../components/SearchAutocomplete';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { darkMode, largeText } = useTheme();

  const [type, setType] = useState("attractions");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [bl_lat, setBl_lat] = useState(null);
  const [bl_lng, setBl_lng] = useState(null);
  const [tr_lat, setTr_lat] = useState(null);
  const [tr_lng, setTr_lng] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    if (bl_lat && bl_lng && tr_lat && tr_lng) {
      setIsLoading(true);
      getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type).then(data => {
        setMainData(data);
        setIsLoading(false);
      });
    }
  }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

  // ✅ HEADER + SEARCH + MENU (SCROLLS WITH LIST)
  const ListHeader = () => (
    <>
      {/* Header */}
      <View className="py-2 mt-2">
        <Text className="font-chillaxregular text-green-950 text-4xl w-2/3">
          Find your favorite place
        </Text>
      </View>

      {/* Search */}
      <SearchAutocomplete
        setBl_lat={setBl_lat}
        setBl_lng={setBl_lng}
        setTr_lat={setTr_lat}
        setTr_lng={setTr_lng}
        setHasSearched={setHasSearched}
      />

      {/* Menu */}
      {hasSearched && (
        <View className="flex-row items-center justify-between py-2 mt-4">
          <MenuContainer
            title="Attractions"
            iconName="attractions"
            imageSrc={Attractions}
            type={type}
            setType={setType}
          />
          <MenuContainer
            title="Restaurants"
            iconName="restaurant"
            imageSrc={Restaurants}
            type={type}
            setType={setType}
          />
          <MenuContainer
            title="Hotels"
            iconName="local-hotel"
            imageSrc={Hotels}
            type={type}
            setType={setType}
          />
        </View>
      )}

      {/* Loader directly below menu */}
      {isLoading && (
        <View className="items-center justify-center mt-10">
          <ActivityIndicator size="large" color="#D81B60" />
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView className="flex-1">
    <FlatList
        data={isLoading ? [] : mainData}
        keyExtractor={(_, i) => i.toString()}
        numColumns={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ListHeaderComponent={ListHeader}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
        <ItemCardContainer
            image={
            item?.photo?.images?.large?.url
                ? item?.photo?.images?.large?.url
                : "https://static.thenounproject.com/png/2932881-200.png"
            }
            title={item?.name}
            location={item?.location_string}
            data={item}
        />
        )}
        ListEmptyComponent={
        !isLoading && (
            <View className="w-full h-[200px] items-center gap-8 justify-center">
            <Text className={`${largeText ? 'text-2xl' : 'text-lg'} text-pink-600`}>
                {hasSearched
                ? "No Results found..."
                : "Search a location to get started!"}
            </Text>
            </View>
        )
        }
    />
    </SafeAreaView>
  );
};

export default HomeScreen;
