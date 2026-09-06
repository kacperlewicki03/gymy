import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseDetailsScreen() {
  const params = useLocalSearchParams<{
    name: string;
    category: string;
    description: string;
    gifUrl?: string;
    isCustom?: string;
  }>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{params.name}</Text>

      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{params.category?.toUpperCase()}</Text>
        {params.isCustom === "true" && (
          <Text style={[styles.badgeText, styles.customBadge]}>WŁASNE</Text>
        )}
      </View>

      {/* Wyświetlanie GIF-a jeśli istnieje */}
      {params.gifUrl ? (
        <View style={styles.gifWrapper}>
          <Image
            source={{ uri: params.gifUrl }}
            style={styles.gif}
            contentFit="contain"
          />
        </View>
      ) : (
        <View style={styles.noGifBox}>
          <Text style={styles.noGifText}>Brak podglądu animacji</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Instrukcja wykonania</Text>
      <Text style={styles.description}>
        {params.description || "Brak opisu dla tego ćwiczenia."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 10 },
  badgeContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  badgeText: {
    backgroundColor: "#222",
    color: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  customBadge: { color: "#34C759", backgroundColor: "#1a2e1f" },
  gifWrapper: {
    width: "100%",
    height: 240,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  gif: { width: "100%", height: "100%" },
  noGifBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noGifText: { color: "#666", fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  description: { fontSize: 15, color: "#aaa", lineHeight: 22 },
});
