import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { db } from "../../data/firebaseconfig";


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [parkedLocation, setParkedLocation] = useState(null)
  const [lotName, setLotName] = useState(null)
  const [favoriteLotId, setFavoriteLotId] = useState(null);
  const [favoriteLot, setFavoriteLot] = useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const DEMO_MODE = true;
  
  // Functions for getting which lot you are in based on your coordinates. 
  function getLotFromLocation(lat, lng) {
    for (let lot of parkingLots) {
      if (
        lat <= lot.north &&
        lat >= lot.south &&
        lng <= lot.east &&
        lng >= lot.west
      ) {
        return lot; // return the whole lot object
      }
    } 
    return null;
  }
  
  // Get location
  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
  
    if (status !== 'granted') {
      alert("Permission denied");
      return null;
    }
  
    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  }

  // PARK function
  async function parkUser() {
    const coords = await getLocation();
    if (!coords) return;
  
    let lot;

if (DEMO_MODE) {
  lot = parkingLots.find(l => l.id === "lot2");
} else {
  lot = getLotFromLocation(coords.latitude, coords.longitude);

  if (!lot) {
    alert("You are not in a parking lot");
    return;
  }
}
  
    // Update UI
    setLotName(lot.name);
    setParkedLocation(coords);
  
    // update firebase 
    try {
      const lotRef = doc(db, "lots", lot.id);
  
      await updateDoc(lotRef, {
        count: increment(1),
        lastUpdated: serverTimestamp()
      });
  
    } catch (error) {
      console.log("Error updating parking:", error);
    }
  }
  
  // UNPARK function
  async function unpark() {
    if (!lotName) return;
  
    const lot = parkingLots.find(l => l.name === lotName);
  
    if (lot) {
      try {
        const lotRef = doc(db, "lots", lot.id);
  
        await updateDoc(lotRef, {
          count: increment(-1),
          lastUpdated: serverTimestamp()
        });
  
      } catch (error) {
        console.log("Error updating parking:", error);
      }
    }
  
    setParkedLocation(null);
    setLotName(null);
  }

  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lots"), (snapshot) => {
      setParkingLots(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      setFavoriteLotId(docSnap.data()?.favoriteLotId || null);
    });
  
    return () => unsub();
  }, []);

  useEffect(() => {
    const lot = parkingLots.find(l => l.id === favoriteLotId);
    setFavoriteLot(lot || null);
  }, [favoriteLotId, parkingLots]);



  return (
    <View style={[styles.screen, { backgroundColor: isDark ? "#000" : "#fff" }]}>
  
      <ImageBackground
        source={require("../../assets/wpimage1.png")}
        style={styles.topBackground}
      >
        <View style={styles.nameheader}>
          <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            Hi Jared
          </Text>
  
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>
            WPARK
          </Text>
        </View>
      </ImageBackground>
  
    
      <View style={styles.middleSection}>
  
        {favoriteLot && (
          <View style={styles.favoriteContainer}>
            <Text style={[styles.favoriteText, { color: isDark ? "#fff" : "#000" }]}>
              Favorite Lot: {favoriteLot.name}
            </Text>
  
            <Text style={{ color: isDark ? "#fff" : "#000" }}>
              {favoriteLot.capacity - favoriteLot.count} spots left
            </Text>
          </View>
        )}
  
        <View style={styles.center}>
          {parkedLocation === null ? (
            <TouchableOpacity style={styles.button} onPress={parkUser}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.buttonText, { color: isDark ? "#fff" : "#000" }]}>
                  PARK
                </Text>
  
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={isDark ? "#fff" : "#000"}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={unpark}>
              <Text style={[styles.buttonText, { color: isDark ? "#fff" : "#000" }]}>
                UNPARK
              </Text>
            </TouchableOpacity>
          )}
        </View>
  
      </View>
  
      {lotName && (
        <View style={styles.parkedMessage}>
          <Text
            style={{
              color: isDark ? "#fff" : "#000",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            You are parked in {lotName}
          </Text>
        </View>
      )}
  
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  button: {
    backgroundColor: "#FFA500",
    padding: 40,
    borderRadius: 100,
    fontSize: 40,
    shadowColor: "#000",
    shadowOpacity: .7,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  screen: {
    flex: 1,
  },
  
  nameheader: {
    position: "absolute",
    top: 70,
    left: 20,
    shadowColor: "#000",
     shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  
  topBackground: {
    height: "60%",
    width: "120%",
    justifyContent: "flex-end",
    padding: 20,
    flex: 1
  },

  center: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20
  },
  parkedMessage: {
    position: "absolute",
    bottom: 40,
    left: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  favoriteContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  
  favoriteText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
