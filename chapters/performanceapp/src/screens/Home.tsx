import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";

import { FriendList } from "../components/FriendList";

interface Data {
  id: string;
  name: string;
  likes: number;
  online: string;
}

export const Home = () => {
  const [name, setName] = useState("");
  const [friends, setFriends] = useState([]);

  async function handleSearch() {
    const response = await fetch(`http://127.0.0.1:3333/friends?q=${name}`);
    const data = await response.json();

    const formattedData = data.map((item: Data) => ({
      id: item.id,
      name: item.name,
      likes: item.likes,
      online: `${new Date().getHours()}:${new Date().getMinutes()}`,
    }));

    setFriends(formattedData);
  }

  const handleUnFollow = useCallback(() => {
    console.log("Deixou de seguir");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amigos</Text>

      <TextInput
        placeholder="Nome do amigo"
        onChangeText={setName}
        style={styles.input}
      />

      <Button title="Buscar" onPress={handleSearch} />

      <ScrollView style={styles.list}>
        {/* // ! Don't do this. This was made to see the profile at react-devtools */}
        <FriendList data={friends} unFollow={handleUnFollow} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    padding: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
  input: {
    borderWidth: 1,
    padding: 7,
    marginBottom: 10,
    marginVertical: 10,
  },
  list: {
    marginVertical: 20,
  },
});
