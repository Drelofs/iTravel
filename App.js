import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import ItemScreen from './screens/ItemScreen';
import MapScreen from './screens/MapScreen';
import ItemLocationScreen from './screens/ItemLocationScreen';
import "./global.css";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          gestureDirection: 'horizontal',
        }}
      >
        {/* Bottom Tabs as the main entry */}
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
  );
}
