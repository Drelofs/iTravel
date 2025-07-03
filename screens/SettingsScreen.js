import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'

const SettingsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-2xl font-semibold text-[#06B2BE]">
            Settings
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen