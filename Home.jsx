import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from 'react-native-vector-icons/Ionicons'

function Item({ item, state, setState, isCelsius }) {
    const conversion = isCelsius ? item.temp - 273.15 : (item.temp - 273.15) * 9 / 5 + 32
    const temperature = `${conversion.toFixed(2)} °${isCelsius ? 'C' : 'F'}`

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopRightRadius: 50, borderBottomLeftRadius: 50, backgroundColor: 'lightskyblue', marginVertical: 10, padding: 10 }}>
            <View>
                <Text>{item.name}</Text>
                <Text>{temperature}</Text>
                <Text>{item.desc}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
                <Image source={{ uri: `http://openweathermap.org/img/wn/${item.icon}@2x.png` }} style={{ height: 100, width: 100, alignSelf: 'center' }} />
            </View>
            <TouchableOpacity onPress={() => {
                const newState = state.filter((x) => x.id != item.id)
                setState(newState)
            }} style={{ position: 'absolute', bottom: 5, right: 5 }}>
                <Ionicons name="trash-outline" size={25} />
            </TouchableOpacity>
        </View>
    )
}

export default function Home({ route, navigation }) {
    const [locations, setLocations] = useState([])
    const [isCelsius, setIsCelsius] = useState(true)

    useEffect(() => {
        AsyncStorage.getItem('LOCATIONS')
            .then(data => {
                if (data) {
                    console.log('hej', data)
                    setLocations(JSON.parse(data))
                }
            })
            .catch((error) => console.error(error))
    }, [])

    useEffect(() => {
        AsyncStorage.setItem('LOCATIONS', JSON.stringify(locations))
            .catch((error) => console.error(error))
    }, [locations])

    useEffect(() => {
        if (route.params?.location) {
            const { lat, lon } = route.params.location

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0ca0f595458a9c6d1368693ee574c944`)
                .then((response) => response.json())
                .then((data) => {
                    const newLocations = [...locations]
                    newLocations.push({ id: data.id, name: data.name, country: data.sys.country, temp: data.main.temp, desc: data.weather[0].description, icon: data.weather[0].icon })
                    setLocations(newLocations)
                })
                .catch(error => console.error(error))
        }
    }, [route.params?.location])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity style={styles.button} onPress={() => setIsCelsius(!isCelsius)}><Text style={styles.buttonText}>{`Switch to ${isCelsius ? 'Farenheit' : 'Celsius'}`}</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add')}><Text style={styles.buttonText}>Add Location</Text></TouchableOpacity>
                    </View>
                )
            }
        })
    }, [isCelsius])

    return (
        <View style={styles.container}>
            {locations && locations.length > 0 ?
                <FlatList
                    data={locations}
                    renderItem={({ item }) => <Item item={item} state={locations} setState={setLocations} isCelsius={isCelsius} />}
                    keyExtractor={(item) => item.id}
                /> :
                <Text>Add a location to see its weather</Text>
            }

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    button: {
        backgroundColor: 'dodgerblue',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white'
    }
});