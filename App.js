import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Add from './Add';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} /* options={{
          headerRight: () => {
            return (
              <View style={{ flexDirection: 'row', gap: 20 }}>

                <TouchableOpacity><Text>Test</Text></TouchableOpacity>
                <TouchableOpacity><Text>Add Location</Text></TouchableOpacity>
              </View>
            )
          }
        }
        } */ />
        <Stack.Screen name='Add' component={Add} options={{title: 'Add Location'}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
