import React, { useEffect, useState } from 'react';
import { Text, View, Button, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import styles from './styles';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';
import { useRef } from 'react';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';



const saveLocation = async (location) => {
  try {
    await AsyncStorage.setItem('selectedLocation', location);
  } catch (error) {
    console.error('Error saving location:', error);
  }
};

async function getCurrentLocation() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.log(error);
  }
}


function Weather () {
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = '03dd78947c672a164d0645200cde4055';
  const [city, setCity] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const isFirstRender = useRef(true);
  const [forecastData, setForecastData] = useState(null);
  const weatherContainerPosition = new Animated.Value(0);  // Initial position
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef(null);


  
  useEffect(() => {
    const retrieveLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('selectedLocation');
        if (savedLocation) {
          console.log()
          setCity(savedLocation);
        }
      } catch (error) {
        console.error('Error retrieving location:', error);
      }
    };
    retrieveLocation();
  }, []);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // it's no longer the first render
    } else {
      // Not a first render, don't call API
      return;
    }
    if (city) {
      console.log()
      getWeatherForCity();
    }
  }, [city]);

  useEffect(() => {
    if (isSearchVisible) {
      Animated.timing(
        weatherContainerPosition,
        {
          toValue: 40,  // Move 100 pixels down
          duration: 200,  // in 500 ms
          useNativeDriver: true,  // Use native driver for better performance
        }
      ).start();
    } else {
      Animated.timing(
        weatherContainerPosition,
        {
          toValue: 0,  // Move back to the top
          duration: 500,  // in 500 ms
          useNativeDriver: true,  // Use native driver for better performance
        }
      ).start();
    }
  }, [isSearchVisible]);
  
  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };
  
// WEATHER

  const getWeatherForCity = () => {
    console.log(city)
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => console.error(error));
  };

  const getWeatherForCurrentLocation = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
    } catch (error) {
        console.error(error);
    }
};

// FORECASTS

const getForecastForCity = async () => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );
    setForecastData(response.data.list);
  } catch (error) {
    console.error(error);
  }
};

const getForecastForCurrentLocation = async (latitude, longitude) => {
  try {
      const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      setForecastData(response.data);
  } catch (error) {
      console.error(error);
  }
};

  const getCityNameFromCoordinates = async (latitude, longitude) => {
    const API_KEY = '03dd78947c672a164d0645200cde4055';
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Extract the city name from the response data
      const cityName = data[0]?.name || '';
  
      return cityName;
    } catch (error) {
      console.error('Error retrieving city name:', error);
      return '';
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={() => setIsSearchVisible(false)}>
      <View style={styles.container}>
        
          <View style={styles.button}>
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={toggleSearchVisibility} style={styles.searchBar}>
                
                {isSearchVisible ? (
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {
                      setCity(text);
                    }}
                    placeholder="Enter a city name"
                    onBlur={() => {
                      getWeatherForCity();
                      saveLocation(city);
                      console.log(city)
                      setCity('');
                      setIsSearchVisible(false);
                    }}
                  />
                ) : (
                  <Text style={styles.locationText}>{weatherData ? weatherData.name : "Change City"}</Text>
                )}
              </TouchableOpacity>
              {isSearchVisible && (
                <Icon 
                  name="ios-navigate"
                  size={24} // size of the icon
                  color="#000" // color of the icon
                  onPress={async () => {
                    const location = await getCurrentLocation();
                    if (location) {
                      const { latitude, longitude } = location.coords;
                      getWeatherForCurrentLocation(latitude, longitude);
                      getForecastForCurrentLocation(latitude, longitude);
                      const cityName = await getCityNameFromCoordinates(latitude, longitude);
                      saveLocation(cityName);
                      console.log(cityName)
                      setIsSearchVisible(false);
                    }
                  }}
                />
              )}
            </View>
          </View>

        {/* Display the weather data */}
        {weatherData && (
          <Animated.View style={[styles.weatherContainer, {transform: [{translateY: weatherContainerPosition}]}]}>
            <Text style={styles.temperatureText}>{`${Math.round((weatherData.main.temp - 273.15) * 9/5 + 32)}°F`}</Text>
            <Text style={styles.text}>{`${weatherData.weather[0].description}`}</Text>
            <Text>{`Humidity: ${weatherData.main.humidity}%`}</Text>
            <Text>{`Wind Speed: ${weatherData.wind.speed}m/s`}</Text>
          </Animated.View>
          
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Weather;

