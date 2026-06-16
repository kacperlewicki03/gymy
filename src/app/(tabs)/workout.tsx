// src/app/(tabs)/workout.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { exerciseService, Exercise } from "../../services/exerciseService";

export default function WorkoutScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await exerciseService.getAllExercises();
      setExercises(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Szybki start</Text>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>+ Rozpocznij pusty trening</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        Dostępne ćwiczenia (z API/Firebase)
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        exercises.map((ex, index) => (
          <View key={ex.id || index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseCategory}>{ex.category}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  exerciseCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  exerciseName: { fontSize: 16, fontWeight: "bold" },
  exerciseCategory: { color: "#666", fontSize: 12, marginTop: 2 },
});
