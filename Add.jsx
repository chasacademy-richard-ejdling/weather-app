import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function Item({ item, navigation }) {
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('Home', { location: { lat: item.lat, lon: item.lon } })} >
                <Text style={{ fontSize: 20 }}>{`${item.name}, ${item.state ? `${item.state}, ` : ''}${item.country}`}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function Add({ navigation }) {
    const [search, setSearch] = useState('')
    const [fetchData, setFetchData] = useState([])

    function getData() {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=0ca0f595458a9c6d1368693ee574c944`)
            .then((response) => response.json())
            .then((data) => {
                setFetchData(data)
            })
            .catch(error => console.error(error))
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} placeholder='City name, state code or country code' onChangeText={setSearch} onSubmitEditing={() => getData()} />
            <TouchableOpacity style={styles.button} onPress={() => getData()} >
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            {fetchData &&
                <FlatList
                    data={fetchData}
                    renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                    keyExtractor={(item) => `${item.lat}${item.lon}`}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap:10,
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
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 6,
        fontSize: 15
    }
})


// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=5&appid=0ca0f595458a9c6d1368693ee574c944