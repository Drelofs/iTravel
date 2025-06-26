import { View, Text, SafeAreaView, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native'
import { Avatar } from '../assets';

const Discover = () => {

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown : false,
        })
    }, [])

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
        </SafeAreaView>
    )
}

export default Discover