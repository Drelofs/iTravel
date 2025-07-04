import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native'
import { Hotels, Attractions, Restaurants } from '../assets';
import MenuContainer from '../components/MenuContainer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ItemCardContainer from '../components/ItemCardContainer';
import { useTheme } from '../contexts/ThemeContext';
import { getPlacesData } from '../api';

const HomeScreen = () => {

    const navigation = useNavigation();
    const { darkMode, toggleTheme } = useTheme();

    const [type, setType] = useState("restaurants")

    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [mainData, setMainData] = useState([]);
    const [bl_lat, setBl_lat] = useState(null);
    const [bl_lng, setBl_lng] = useState(null);
    const [tr_lat, setTr_lat] = useState(null);
    const [tr_lng, setTr_lng] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown : false,
        })
    }, []);

    useEffect(() => {
        // Only fetch when all coordinates are set (after user selects from autocomplete)
        if (bl_lat && bl_lng && tr_lat && tr_lng) {
            setIsLoading(true);
            getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type).then(data => {
                setMainData(data);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            });
        }
    }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

    return (
        <SafeAreaView className={darkMode ? "flex-1 bg-black" : "flex-1 bg-white"}>
            <View className="flex-row items-center justify-between px-8">
                <View>
                    <Text className="text-pink-600 text-[36px]">Travel App</Text>
                </View>

                <View>
                    <TouchableOpacity onPress={() => navigation.navigate("MapScreen")} className="border border-pink-600 w-12 h-12 rounded-md items-center justify-center">
                        <MaterialCommunityIcons name="google-maps" size={24} color="#D81B60" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className={`flex-row items-center ${darkMode ? "bg-black border-gray-800" : "bg-white border-gray-300" } border-2 mx-4 rounded-xl py-1 px-2 mt-4`}>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    GooglePlacesDetailsQuery={{fields : "geometry"}}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        setBl_lat(details?.geometry?.viewport?.southwest?.lat);
                        setBl_lng(details?.geometry?.viewport?.southwest?.lng);
                        setTr_lat(details?.geometry?.viewport?.northeast?.lat);
                        setTr_lng(details?.geometry?.viewport?.northeast?.lng);
                        setHasSearched(true);
                    }}
                    query={{
                        key: 'AIzaSyAKDlpICho17hF_JnMbX6nMXIFmQkuTFj0',
                        language: 'en',
                        types: 'geocode',
                    }}
                    autoFillOnNotFound={false}
                    currentLocation={false}
                    currentLocationLabel="Current location"
                    debounce={0}
                    disableScroll={false}
                    enableHighAccuracyLocation={true}
                    enablePoweredByContainer={true}
                    filterReverseGeocodingByTypes={[]}
                    GooglePlacesSearchQuery={{
                        rankby: 'distance',
                        type: 'restaurant',
                    }}
                    GoogleReverseGeocodingQuery={{}}
                    isRowScrollable={true}
                    keyboardShouldPersistTaps="always"
                    listUnderlayColor="#c8c7cc"
                    listViewDisplayed="auto"
                    keepResultsAfterBlur={false}
                    minLength={1}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    numberOfLines={1}
                    onFail={() => {
                        console.warn('Autocomplete failed');
                    }}
                    onNotFound={() => {
                        console.log('No results found');
                    }}
                    onTimeout={() =>
                        console.warn('Google Places Autocomplete: Request timeout')
                    }
                    predefinedPlaces={[]}
                    predefinedPlacesAlwaysVisible={false}
                    styles={{
                        textInputContainer: {
                            backgroundColor: darkMode ? '000' : '#fff',   // background behind the text input
                            borderRadius: 10,
                            marginHorizontal: 0,
                            marginTop: 0,
                            borderBottomWidth: 0,
                            borderTopWidth: 0,
                          },
                          textInput: {
                            backgroundColor: darkMode ? '#000' : '#fff',   // the input field itself
                            color: darkMode ? '#fff' : '#000',
                            borderRadius: 10,
                            fontSize: 16,
                            height: 40,
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                          },
                          listView: {
                            backgroundColor: darkMode ? '#111' : '#fff',  // dropdown list background
                            borderRadius: 10,
                            marginHorizontal: 0,
                          },
                          description: {
                            color: darkMode ? '#eee' : '#444',            // text color of autocomplete rows
                          },
                          predefinedPlacesDescription: {
                            color: darkMode ? '#aaa' : '#666',
                          },
                          separator: {
                            backgroundColor: darkMode ? '#555' : '#ccc',
                        },
                    }}
                    suppressDefaultStyles={false}
                    textInputHide={false}
                    textInputProps={{}}
                    timeout={20000}
                />
            </View>

            {/* Menu container */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0B646B" />
                </View> 
            ) : ( 
                <ScrollView>
                    <View className="flex-row items-center justify-between px-8 mt-8">
                        <MenuContainer 
                            key={"restaurants"}
                            title="Restaurants"
                            imageSrc= {Restaurants}
                            type={type}
                            setType={setType}
                        />
                        <MenuContainer 
                            key={"hotels"}
                            title="Hotels"
                            imageSrc= {Hotels}
                            type={type}
                            setType={setType}
                        />
                        <MenuContainer 
                            key={"attractions"}
                            title="Attractions"
                            imageSrc= {Attractions}
                            type={type}
                            setType={setType}
                        />
                    </View>

                    <View>
                        <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap w-full">
                            {mainData?.length > 0 ? (
                                <>
                                   {mainData?.map((data, i) => (
                                        <ItemCardContainer 
                                            key={i} 
                                            image={
                                                data?.photo?.images?.medium?.url 
                                                ? data?.photo?.images?.medium?.url 
                                                : "https://static.thenounproject.com/png/2932881-200.png"
                                            }
                                            title={data?.name}
                                            location={data?.location_string}
                                            data={data}
                                        />
                                   ))}
                                </> 
                            ) : (
                                <>
                                    <View className="w-full h-[200px] items-center gap-8 justify-center">
                                        <Text className="text-2xl text-[#428288]">
                                            {hasSearched ? "No Results found..." : "Search a location to get started!"}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            )
            }
        </SafeAreaView>
    )
}

export default HomeScreen