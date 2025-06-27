import { View, Text, TouchableOpacity, Image } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'

const ItemCardContainer = ({image, title, location} ) => {
  return (
    <TouchableOpacity className="rounded-md border border-gray-300 gap-2 px-3 py-2 shadow-md bg-white w-[170px] my-2">
        <Image 
            source={{uri : image}}
            className="w-full h-40 rounded-md object-cover"
        />

        {title ? (
            <>
                <Text className="text-[#428288] text-[18px] font-bold">
                    {title?.length >12  ? `${title.slice(0,12)}...` : title}
                </Text>

                <View className="flex-row items-center gap-1">
                    <FontAwesome name="map-marker" size={20} color="#FF0000" />
                    <Text className="text-[#428288] text-[14px] font-bold">
                        {location?.length >18  ? `${location.slice(0,18)}...` : location}
                    </Text>
                </View>
            </>
        ) : (
            <></>
        )}
    </TouchableOpacity>
  )
}

export default ItemCardContainer