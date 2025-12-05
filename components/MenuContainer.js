import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useTheme } from '../contexts/ThemeContext';

const MenuContainer = ({title, imageSrc, type, setType}) => {
    const { darkMode, largeText } = useTheme();
    const handlePress = () => {
        setType(title.toLowerCase())
    }
    return (
        <TouchableOpacity className="items-center justify-center gap-y-2" onPress={handlePress}>
            {/* <View className={`p-4 shadow-sm rounded-xl items-center justify-center`}>
                <Image 
                    source={imageSrc} className="w-full h-full object-contain" />
            </View> */}
            <Text className={`py-2 px-4 rounded-xl ${largeText ? 'text-2xl' : 'text-lg'} ${darkMode ? "text-slate-100" : "text-gray-900"} ${type === title.toLowerCase() ? "bg-pink-600" : ""}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default MenuContainer