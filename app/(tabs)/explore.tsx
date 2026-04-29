import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../data/firebaseconfig";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#000",
    title: isDark ? "#fff" : "#000",
  };
  const router = useRouter();
  const [parkingLots, setParkingLots] = useState([]);
  const [favoriteLotId, setFavoriteLotId] = useState(null);

  async function setFavorite(lotId) {
    const settingsRef = doc(db, "settings", "global");
  
    await updateDoc(settingsRef, {
      favoriteLotId: lotId
    });
  }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lots"), (snapshot) => {
      const lotsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setParkingLots(lotsData);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      setFavoriteLotId(docSnap.data()?.favoriteLotId);
    });
  
    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: theme.background }]}>
      <View style={[styles.headerContainer, { paddingTop: 10, paddingLeft: 20 }]}>
        <Text style={[styles.title, { color: theme.title }]}>
          Parking Lots
        </Text>
      </View>

      <View style={styles.centerContainer}>
        <FlatList
          data={parkingLots}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}

          renderItem={({ item }) => {
            const spotsLeft = (item.capacity ?? 0) - (item.count ?? 0);
            
            return (
            <TouchableOpacity
              style={styles.lotButton}
              onPress={() => router.push("/lotMap")}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
              <Text style={[styles.lotText, { color: theme.text}]}>
                {item.name}
              </Text>

              <Text style={{ color: theme.text, fontSize: 16}}>
                {spotsLeft ?? 0} open spots
              </Text>
                </View>

                <View style= {{flexDirection: "row", alignItems: "center", width: "90%"}}>

    
              <TouchableOpacity onPress={() => setFavorite(item.id)}>
                  
                <Ionicons
                  name={favoriteLotId === item.id ? "star" : "star-outline"}
                  size={24}
                  color={favoriteLotId === item.id ? "#000" : (isDark ? "#fff" : "#000")}
                />
                </TouchableOpacity>
              <Text style={{fontSize: 10, color: theme.text, padding: 5}}>
                Last updated: {item.lastUpdated?.toDate().toLocaleTimeString()}
              </Text> 
                </View>
            </TouchableOpacity>
            )}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  centerContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  lotButton: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: 250,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  lotText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});