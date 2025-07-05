import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../contexts/ThemeContext';

export default function FaceIDScreen({ navigation }) {
  const [isSupported, setIsSupported] = useState(false);
  const { darkMode, largeText } = useTheme();

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsSupported(compatible);
    })();
  }, []);

  const handleAuthenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        Alert.alert('Success', 'You are authenticated!');
        navigation.replace('MainTabs'); // for example
      } else {
        Alert.alert('Failed', 'Authentication failed or cancelled');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  if (!isSupported) {
    return (
      <View className={`${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Biometric authentication is not supported on this device.</Text>
      </View>
    );
  }

  return (
    <View className={`${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login with Face ID" onPress={handleAuthenticate} />
    </View>
  );
}
