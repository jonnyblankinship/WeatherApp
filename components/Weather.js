import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import axios from 'axios';
import styles from './styles';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = '03dd78947c672a164d0645200cde4055';
  const city = 'Colorado Springs';

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {weatherData ? (
        <View>
          <Text style={styles.text}>{`City: ${weatherData.name}`}</Text>
          <Text style={styles.text}>{`Temperature: ${Math.round(weatherData.main.temp * 9/5 - 459.67)} F`}</Text>
          <Text style={styles.text}>{`Description: ${weatherData.weather[0].description}`}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Weather;
