import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, ActivityIndicator, Pressable, Keyboard } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native'
import { Hotels, Attractions, Restaurants } from '../assets';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MenuContainer from '../components/MenuContainer';
import ItemCardContainer from '../components/ItemCardContainer';
import { useTheme } from '../contexts/ThemeContext';
import { getPlacesData } from '../api';
import Constants from 'expo-constants';

const HomeScreen = () => {

    const GOOGLE_PLACES_API_KEY = Constants.expoConfig.extra.GOOGLE_PLACES_API_KEY;

    const autoCompleteRef = useRef(null);
    const navigation = useNavigation();
    const { darkMode, largeText } = useTheme();

    const [type, setType] = useState("attractions")

    const [inputFocused, setInputFocused] = useState(false);
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
        // Only fetch when all coordinates are set from autocomplete
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
        <Pressable
            style={{ flex: 1 }}
            onPress={() => {
                Keyboard.dismiss();
                setInputFocused(false);
                autoCompleteRef.current?.blur();
            }}
        >
            <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-white"}`}>

                <View className="px-4 py-6">
                    <View>
                        <Text className="text-pink-600 text-4xl font-light w-2/3">Find your favorite place</Text>
                    </View>
                </View>

                <View
                    style={{
                        height: 48,
                        justifyContent: "center",
                        marginHorizontal: 16,
                        marginTop: 16,
                        borderRadius: 16,
                        backgroundColor: darkMode ? "#000" : "#f5f5f5",
                        overflow: "visible",
                        zIndex: 50,
                        borderWidth: 1,
                        borderColor: darkMode ? "#444" : "#ddd",
                    }}
                >
                    <GooglePlacesAutocomplete
                        ref={autoCompleteRef}
                        renderLeftButton={() => (
                        <View className="justify-center pl-3">
                            <EvilIcons
                            name="search"
                            size={24}
                            color={darkMode ? "#fff" : "#000"}
                            />
                        </View>
                        )}

                        placeholder="Search"

                        GooglePlacesDetailsQuery={{ fields: "geometry" }}
                        fetchDetails={true}

                        onPress={(data, details = null) => {
                        setBl_lat(details?.geometry?.viewport?.southwest?.lat);
                        setBl_lng(details?.geometry?.viewport?.southwest?.lng);
                        setTr_lat(details?.geometry?.viewport?.northeast?.lat);
                        setTr_lng(details?.geometry?.viewport?.northeast?.lng);
                        setHasSearched(true);
                        }}

                        query={{
                        key: GOOGLE_PLACES_API_KEY,
                        language: "en",
                        types: "geocode",
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
                        rankby: "distance",
                        type: "restaurant",
                        }}

                        GoogleReverseGeocodingQuery={{}}

                        isRowScrollable={true}
                        keyboardShouldPersistTaps="handled"
                        listUnderlayColor="#c8c7cc"
                        listViewDisplayed={inputFocused}
                        keepResultsAfterBlur={false}
                        minLength={1}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        numberOfLines={1}

                        onFail={() => {
                        console.warn("Autocomplete failed");
                        }}

                        onNotFound={() => {
                        console.log("No results found");
                        }}

                        onTimeout={() =>
                        console.warn("Google Places Autocomplete: Request timeout")
                        }

                        predefinedPlaces={[]}
                        predefinedPlacesAlwaysVisible={false}

                        styles={{
                        textInputContainer: {
                            flexDirection: "row",
                            alignItems: "center",
                            height: 48,
                            backgroundColor: "transparent",
                            paddingHorizontal: 4,
                        },

                        textInput: {
                            flex: 1,
                            height: 40,
                            backgroundColor: "transparent",
                            color: darkMode ? "#fff" : "#000",
                            fontSize: largeText ? 20 : 16,
                            borderRadius: 16,
                            paddingLeft: 10,
                        },         

                        listView: {
                            position: "absolute",
                            top: 52,
                            left: 0,
                            right: 0,
                            backgroundColor: darkMode ? "#000" : "#fff",
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: darkMode ? "#444" : "#ddd",
                            overflow: "hidden",
                            zIndex: 1000,
                            elevation: 12,
                        },  

                        row: {
                            backgroundColor: darkMode ? "#000" : "#fff",
                            padding: 13,
                            height: 44,
                            flexDirection: "row",
                        },

                        poweredContainer: {
                            backgroundColor: darkMode ? "#000" : "#fff",
                            borderTopWidth: 0,
                            padding: 10
                        },

                        powered: {
                            tintColor: darkMode ? "#aaa" : "#666",
                        },

                        description: {
                            color: darkMode ? "#eee" : "#444",
                            fontSize: largeText ? 16 : 13,
                        },

                        predefinedPlacesDescription: {
                            color: darkMode ? "#333" : "#666",
                        },

                        separator: {
                            backgroundColor: darkMode ? "#555" : "#ccc",
                        },
                        }}

                        textInputProps={{
                            placeholderTextColor: darkMode ? "#888" : "#888",
                          
                            onFocus: () => setInputFocused(true),
                          
                            onBlur: () => {
                              setTimeout(() => {
                                setInputFocused(false);
                              }, 150); // allows tap on suggestion
                            },
                        }}

                        suppressDefaultStyles={true}
                        textInputHide={false}
                        timeout={20000}
                    />
                </View>


                {/* Menu container */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#D81B60" />
                    </View> 
                ) : ( 
                    <ScrollView>
                        {hasSearched && (
                        <View className="flex-row items-center justify-between px-4 mt-4">
                            <MenuContainer 
                                key={"attractions"}
                                title="Attractions"
                                imageSrc={Attractions}
                                type={type}
                                setType={setType}
                            />
                            <MenuContainer 
                                key={"restaurants"}
                                title="Restaurants"
                                imageSrc={Restaurants}
                                type={type}
                                setType={setType}
                            />
                            <MenuContainer 
                                key={"hotels"}
                                title="Hotels"
                                imageSrc={Hotels}
                                type={type}
                                setType={setType}
                            />
                        </View>
                        )}

                        <View>
                            <View className="px-4 mt-8 flex-row items-center flex-wrap w-full gap-4">
                                {mainData?.length > 0 ? (
                                    <>
                                    {mainData?.map((data, i) => (
                                            <ItemCardContainer 
                                                key={i} 
                                                image={
                                                    data?.photo?.images?.large?.url 
                                                    ? data?.photo?.images?.large?.url 
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
                                            <Text className={`${largeText ? 'text-2xl' : 'text-lg'} text-pink-600 text-xl}`}>
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
        </Pressable>
    )
}

export default HomeScreen