import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'top',
  },
  text: {
    fontSize: 30,
    letterSpacing: 2,
  },
  locationText: {
    fontSize: 18,
    letterSpacing: 3,
  },
  temperatureText: {
    fontSize: 80, // or any other font size you prefer
  },
  weatherContainer: {
    justifyContent: "Center",
    alignItems: "Center",
    marginTop: 5,
    top: 100,
    padding: 5,
    backgroundColor: 'white'
  },
  forecastContainer: {
    justifyContent: "Center",
    alignItems: "Center",
    marginTop: 5,
    top: 1000,
    padding: 10,
    backgroundColor: 'gray'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: '80%', // For example
    alignSelf: 'center',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
},
searchContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 5,
},
searchBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 5,
  backgroundColor: 'white',
  justifyContent: "center",
},

  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    
    position: 'relative',
    top: 60,
    right: 0,
  },
});

export default styles;
