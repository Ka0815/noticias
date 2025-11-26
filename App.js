import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "Últimas Notícias" }} 
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={{ title: "Notícia" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function HomeScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);


  const API_KEY = "ef295707c00a9c2266dedc5de6940791";

  useEffect(() => {
    fetch(`https://gnews.io/api/v4/top-headlines?country=br&lang=pt&apikey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando notícias...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate("Details", { url: item.url })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.source.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}


function DetailsScreen({ route }) {
  const { url } = route.params;
  return <WebView source={{ uri: url }} />;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  placeholderImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});
