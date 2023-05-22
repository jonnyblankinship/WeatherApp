import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Weather from './components/Weather';
import styles from './components/styles'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Weather textStyle={styles.text} />
    </View>
  );
}

