import { View, Text, TouchableOpacity, Image } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

const ItemCardContainer = ({image, title, location, data} ) => {
    const navigation = useNavigation();
    const { darkMode, toggleTheme } = useTheme();
    return (
        <TouchableOpacity onPress={() => navigation.navigate("ItemScreen", {param: data})} className={`gap-2 rounded-xl ${darkMode ? "bg-neutral-800" : "bg-white border border-slate-200"} w-full overflow-hidden my-2`}>
            <Image 
                source={{uri : image}}
                className="w-full h-60 object-cover"
            />

            {title ? (
                <View className="px-4 pb-8 pt-2">
                    <Text className="text-pink-600 text-2xl font-bold">
                        {title?.length >28  ? `${title.slice(0,28)}...` : title}
                    </Text>

                    <View className="flex-row items-center gap-1">
                        <FontAwesome name="map-marker" size={20} color="#FF0000" />
                        <Text className="text-pink-600 text-[14px] font-bold">
                            {location?.length >32  ? `${location.slice(0,32)}...` : location}
                        </Text>
                    </View>
                </View>
            ) : (
                <></>
            )}
        </TouchableOpacity>
    )
}

export default ItemCardContainer