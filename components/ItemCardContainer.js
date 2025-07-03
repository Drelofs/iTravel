import { View, Text, TouchableOpacity, Image } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const ItemCardContainer = ({image, title, location, data} ) => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("ItemScreen", {param: data})} className="border border-gray-300 gap-2 rounded-md shadow-md bg-white w-full my-2">
        <Image 
            source={{uri : image}}
            className="w-full h-60 rounded-md object-cover"
        />

        {title ? (
            <View className="px-4 pb-4 pt-2">
                <Text className="text-[#428288] text-2xl font-bold">
                    {title?.length >28  ? `${title.slice(0,28)}...` : title}
                </Text>

                <View className="flex-row items-center gap-1">
                    <FontAwesome name="map-marker" size={20} color="#FF0000" />
                    <Text className="text-[#428288] text-[14px] font-bold">
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