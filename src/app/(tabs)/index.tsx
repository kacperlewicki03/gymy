import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

// Przykładowe dane z bazy (później zastąpimy to Firebase)
const MOCK_HISTORY = [
  {
    id: "1",
    name: "Góra Ciała (Push)",
    date: "12.05.2026",
    exercises: "Wyciskanie leżąc, OHP, Dipy",
  },
  {
    id: "2",
    name: "Nogi (Pull)",
    date: "10.05.2026",
    exercises: "Martwy ciąg, Wiosłowanie, Uginanie",
  },
  {
    id: "3",
    name: "Pusty trening",
    date: "08.05.2026",
    exercises: "Przysiady, Wykroki",
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Proste filtrowanie po nazwie treningu lub ćwiczeniach
  const filteredData = MOCK_HISTORY.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exercises.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Szukaj treningu lub ćwiczenia..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlashList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.exercises}>{item.exercises}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 14, color: "#666", marginTop: 4 },
  exercises: { fontSize: 14, color: "#444", marginTop: 8 },
});
