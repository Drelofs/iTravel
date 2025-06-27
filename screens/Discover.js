import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native'
import { Avatar, Hotels, Attractions, Restaurants } from '../assets';
import MenuContainer from '../components/MenuContainer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ItemCardContainer from '../components/ItemCardContainer';
import { getPlacesData } from '../api';

const Discover = () => {

    const navigation = useNavigation();

    const [type, setType] = useState("restaurants")
    const [isLoading, setIsLoading] = useState(false);
    const [mainData, setMainData] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown : false,
        })
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getPlacesData().then(data => {
            setMainData(data)
            setInterval(() => {
                setIsLoading(false)
            }, 2000);
        });
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <View className="flex-row items-center justify-between px-8">
                <View>
                    <Text className="text-[40px] text-[#0B646B] font-bold">Discover</Text>
                    <Text className="text-[#527283] text-[36px]">the beauty today</Text>
                </View>

                <View className="w-12 h-12 bg-gray-400 rounded-md items-center justify-center">
                    <Image
                        source={Avatar}
                        className="w-full h-full rounded-md object-cover shadow-lg"
                    />
                </View>
            </View>

            <View className="flex-row items-center bg-white border-2 border-gray-300 mx-4 rounded-xl py-1 px-2 mt-4">
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    GooglePlacesDetailsQuery={{fields : "geometry"}}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        console.log(details?.geometry?.viewport);
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
                    styles={{}}
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
                        <View className="flex-row items center justify-between  px-4 mt-8">
                            <Text className="text-[#2C7379] text-[28px] font-bold">Results</Text>
                            <TouchableOpacity className="flex-row items-center justify-center gap-2">
                                <Text className="text-[#A0C4C7] text-[20px] font-bold">Explore</Text>
                                <FontAwesome name="long-arrow-right" size={24} color="#A0C4C7" />
                            </TouchableOpacity>
                        </View>

                        <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap w-full">
                            {mainData?.length > 0 ? (
                                <>
                                   {mainData?.map((data, i) => (
                                        <ItemCardContainer 
                                            key={i} 
                                            image={
                                                data?.photo?.images?.medium?.url ?  
                                                data?.photo?.images?.medium?.url :
                                                "https://static.thenounproject.com/png/2932881-200.png"
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
                                        <Text className="text-2xl text-[#428288]">No Results found...</Text>
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

export default Discover