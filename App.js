import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import ItemScreen from './screens/ItemScreen';
import MapScreen from './screens/MapScreen';
import ItemLocationScreen from './screens/ItemLocationScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { View, StatusBar } from 'react-native';
import './global.css';

const Stack = createNativeStackNavigator();

function AppWrapper() {
  const { darkMode } = useTheme();

  return (
    <View className={darkMode ? 'flex-1 dark' : 'flex-1'}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        animated={true}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"  // Start directly on MainTabs
          screenOptions={{
            animation: 'slide_from_right',
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ItemScreen" component={ItemScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="ItemLocationScreen" component={ItemLocationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}
