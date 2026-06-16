import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMetric, setIsMetric] = useState(true); // true = kg/cm, false = lbs/in

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.userName}>Adam Kowalski</Text>
        <Text style={styles.userEmail}>adam@example.com</Text>
      </View>

      <Text style={styles.sectionTitle}>Ustawienia</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Tryb Ciemny</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>System metryczny (kg, cm)</Text>
        <Switch value={isMetric} onValueChange={setIsMetric} />
      </View>

      <TouchableOpacity style={styles.settingRow}>
        <Text style={styles.settingText}>Język</Text>
        <Text style={styles.settingValue}>Polski {">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Wyloguj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  profileHeader: { alignItems: "center", marginBottom: 32, marginTop: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  userName: { fontSize: 20, fontWeight: "bold" },
  userEmail: { color: "#666", marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingText: { fontSize: 16 },
  settingValue: { fontSize: 16, color: "#888" },
  logoutButton: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#ffebee",
  },
  logoutText: { color: "#d32f2f", fontWeight: "bold", fontSize: 16 },
});
