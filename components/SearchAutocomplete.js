import 'react-native-get-random-values';
import React, { useRef, useState } from 'react';
import { View, Keyboard, Platform } from 'react-native'; 
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useTheme } from '../contexts/ThemeContext';
import Constants from 'expo-constants';

const SearchAutocomplete = ({
    setBl_lat,
    setBl_lng,
    setTr_lat,
    setTr_lng,
    setHasSearched
}) => {
    const GOOGLE_PLACES_API_KEY = Constants.expoConfig.extra.GOOGLE_PLACES_API_KEY;
    const autoCompleteRef = useRef(null);
    const { darkMode, largeText } = useTheme();

    // Internal State for UI Logic
    const [inputFocused, setInputFocused] = useState(false);
    const [inputText, setInputText] = useState(""); 
    
    // List is visible only if focused AND text is present
    const isListOpen = inputFocused && inputText.length > 0;

    // Helper to dismiss keyboard and blur the field
    const dismissSearch = () => {
        Keyboard.dismiss();
        setInputFocused(false);
    };

    // Define permanent shadow properties
    const shadowStyle = Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3.84,
        },
        android: {
            elevation: 5,
        },
    });

    return (
        <View
            style={{
                justifyContent: "center",
                marginTop: 16,
                
                ...shadowStyle,
                
                // Keep high zIndex and position for proper stacking context
                zIndex: 9999, 
                position: 'relative', 
            }}
        >
            <GooglePlacesAutocomplete
                ref={autoCompleteRef}
                keyboardShouldPersistTaps="handled"
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
                    // This is the function that must be allowed to complete!
                    setBl_lat(details?.geometry?.viewport?.southwest?.lat);
                    setBl_lng(details?.geometry?.viewport?.southwest?.lng);
                    setTr_lat(details?.geometry?.viewport?.northeast?.lat);
                    setTr_lng(details?.geometry?.viewport?.northeast?.lng);
                    setHasSearched(true);
                    dismissSearch(); 
                }}
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: "en",
                    types: "geocode",
                }}
                autoFillOnNotFound={false}
                currentLocation={false}
                listViewDisplayed={isListOpen} 
                minLength={1}
                nearbyPlacesAPI="GooglePlacesSearch"
                numberOfLines={1}

                onFail={() => console.warn("Autocomplete failed")}
                onNotFound={() => console.log("No results found")}
                onTimeout={() => console.warn("Google Places Autocomplete: Request timeout")}
                
                predefinedPlaces={[]} 
                predefinedPlacesAlwaysVisible={false}
                filterReverseGeocodingByTypes={[]} 
                
                // 🚀 FIX 1: Disable the powered-by container to simplify the touch/view hierarchy
                enablePoweredByContainer={false}

                styles={{
                    textInputContainer: {
                        flexDirection: "row",
                        alignItems: "center",
                        height: 48,
                        
                        backgroundColor: darkMode ? "#000" : "#f5f5f5",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomLeftRadius: isListOpen ? 0 : 16,
                        borderBottomRightRadius: isListOpen ? 0 : 16,
                        width: "100%", 
                        borderWidth: 0, 
                        borderBottomWidth: 0, 
                    },
                    textInput: {
                        flex: 1,
                        height: 40,
                        backgroundColor: "transparent",
                        color: darkMode ? "#fff" : "#000",
                        fontSize: largeText ? 20 : 16,
                        borderRadius: 0,
                        paddingLeft: 10,
                    },         
                    listView: {
                        position: "absolute",
                        top: 49, 
                        left: 0, 
                        right: 0, 
                        backgroundColor: darkMode ? "#000" : "#f5f5f5", 
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                        borderWidth: 0, 
                        borderTopWidth: 0, 
                        overflow: "hidden",
                        zIndex: 1000,
                    },  
                    row: {
                        backgroundColor: darkMode ? "#000" : "#f5f5f5",
                        padding: 13,
                        height: 44,
                        flexDirection: "row",
                    },
                    description: {
                        color: darkMode ? "#eee" : "#444",
                        fontSize: largeText ? 16 : 13,
                    },
                    separator: {
                        backgroundColor: darkMode ? "#555" : "#ccc",
                    },
                }}

                textInputProps={{
                    placeholderTextColor: darkMode ? "#888" : "#888",
                  
                    onFocus: () => setInputFocused(true),
                  
                    // ❗️IMPORTANT: Do NOT close list immediately on blur
                    onBlur: () => {
                      setTimeout(() => {
                        setInputFocused(false);
                      }, 150); // allows row press to register on real devices
                    },
                  
                    onChangeText: (text) => setInputText(text),
                  }}
                  

                suppressDefaultStyles={true}
                textInputHide={false}
            />
        </View>
    );
};

export default SearchAutocomplete;