import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Discover from './screens/Discover';
import ItemScreen from './screens/ItemScreen';
import MapScreen from './screens/MapScreen';
import "./global.css";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right', // default on iOS
          gestureDirection: 'horizontal', // ensure horizontal swipe works
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="ItemScreen" component={ItemScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
