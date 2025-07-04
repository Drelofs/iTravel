import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const MenuContainer = ({title, imageSrc, type, setType}) => {
    const handlePress = () => {
        setType(title.toLowerCase())
    }
    return (
        <TouchableOpacity className="items-center justify-center gap-y-2" onPress={handlePress}>
            <View className={`w-24 h-24 p-4 shadow-sm rounded-xl items-center justify-center ${type === title.toLowerCase() ? "bg-pink-600" : ""}`}>
                <Image 
                    source={imageSrc} className="w-full h-full object-contain" />
            </View>
            <Text className="text-pink-600 text-xl font-semibold">{title}</Text>
        </TouchableOpacity>
    )
}

export default MenuContainer