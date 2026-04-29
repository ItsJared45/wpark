import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function LotMap(){

    const router = useRouter();
    const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

    return(
        <SafeAreaView style= {{flex: 1}}>
            <Stack.Screen options={{ headerShown: false }} />
            <View>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style = {[styles.Text, {color: isDark ? "#fff" : "#000"}]}>← Back</Text>
                </TouchableOpacity>
            </View>
            <View style = {[styles.container]}>
                <Text style = {[styles.Title, { color: isDark ? "#fff" : "#000"}]}>Lot Map Images coming soon...</Text>
            </View>
            
        </SafeAreaView>
    );
};
    const styles = StyleSheet.create ({
        Title: {
            fontSize: 24,
            fontWeight: 'bold', 
            color: '#333',
            textAlign: 'center',
            
        },

        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        
        Text: {
            fontSize: 20,
            padding: 10,
        }
    });
