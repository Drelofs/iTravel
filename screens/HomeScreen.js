import { View, Text, SafeAreaView, ScrollView, Keyboard, ActivityIndicator } from 'react-native' 
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Hotels, Attractions, Restaurants } from '../assets';
import MenuContainer from '../components/MenuContainer';
import ItemCardContainer from '../components/ItemCardContainer';
import { useTheme } from '../contexts/ThemeContext';
import { getPlacesData } from '../api';

// IMPORT THE NEW COMPONENT
import SearchAutocomplete from '../components/SearchAutocomplete'; 

const HomeScreen = () => {
    const navigation = useNavigation();
    const { darkMode, largeText } = useTheme();

    const [type, setType] = useState("attractions")
    
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
        <View style={{ flex: 1 }}>
            <SafeAreaView className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-white"}`}>

                {/* Fixed Header */}
                <View className="px-4 py-2">
                    <View>
                        <Text className="text-pink-600 text-4xl font-light w-2/3">Find your favorite place</Text>
                    </View>
                </View>

                {/* Fixed Search Autocomplete (Outside ScrollView) */}
                <SearchAutocomplete
                    setBl_lat={setBl_lat}
                    setBl_lng={setBl_lng}
                    setTr_lat={setTr_lat}
                    setTr_lng={setTr_lng}
                    setHasSearched={setHasSearched}
                />
                
                {/* Scrollable Content */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#D81B60" />
                    </View> 
                ) : ( 
                    <ScrollView 
                        style={{ flex: 1 }} 
                        // CRITICAL: Ensures taps on search results are handled.
                        keyboardShouldPersistTaps="handled" 
                    >
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
                                            <Text className={`${largeText ? 'text-2xl' : 'text-lg'} text-pink-600 text-xl`}>
                                                {hasSearched ? "No Results found..." : "Search a location to get started!"}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    )
}

export default HomeScreen;