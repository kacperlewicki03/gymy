import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../theme/typography";
import { Exercise, ExerciseCategory } from "../types/exercise";
import {
  fetchAllExercises,
  createCustomExercise,
} from "../services/exerciseService";

interface ExercisePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const CATEGORIES: (ExerciseCategory | "all")[] = [
  "all",
  "chest",
  "back",
  "leg",
  "shoulder",
  "bicep",
  "triceps",
  "glute",
  "ab",
];

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  visible,
  onClose,
  onSelectExercise,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const lang = i18n.language.startsWith("pl") ? "pl" : "en";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "all"
  >("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Custom exercise form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customCat, setCustomCat] = useState<ExerciseCategory>("chest");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (visible) {
      loadExercises();
    }
  }, [visible]);

  const loadExercises = async () => {
    setLoading(true);
    const data = await fetchAllExercises();
    setExercises(data);
    setLoading(false);
  };

  const filteredExercises = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return exercises.filter((ex) => {
      const matchesCat =
        selectedCategory === "all" ||
        ex.category === selectedCategory ||
        ex.secondaryCategories?.includes(selectedCategory);

      const matchesSearch =
        !q ||
        ex.name.en.toLowerCase().includes(q) ||
        ex.name.pl.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [exercises, searchQuery, selectedCategory]);

  const handleCreateCustom = async () => {
    if (!customName.trim()) return;
    setCreating(true);
    try {
      const created = await createCustomExercise({
        name: customName,
        description: customDesc || "-",
        category: customCat,
      });
      setExercises((prev) => [created, ...prev]);
      setCustomName("");
      setCustomDesc("");
      setShowCustomForm(false);
      onSelectExercise(created);
      onClose();
    } catch (err) {
      Alert.alert("Error", "Could not create custom exercise.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        {/* Top Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="close" size={26} color={theme.text} />
          </TouchableOpacity>
          <Text style={[typography.h3, { color: theme.text }]}>
            {t("exercises.title")}
          </Text>
          <TouchableOpacity
            onPress={() => setShowCustomForm((prev) => !prev)}
            style={styles.iconBtn}
          >
            <Ionicons
              name={showCustomForm ? "list-outline" : "add-circle-outline"}
              size={26}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {showCustomForm ? (
          /* Inline Custom Exercise Creator */
          <ScrollView contentContainerStyle={styles.customForm}>
            <Text
              style={[typography.h3, { color: theme.text, marginBottom: 12 }]}
            >
              {t("exercises.addCustom")}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={t("exercises.namePlaceholder")}
              placeholderTextColor={theme.textSecondary}
              value={customName}
              onChangeText={setCustomName}
            />

            <TextInput
              style={[
                styles.input,
                {
                  height: 84,
                  paddingTop: 12,
                  textAlignVertical: "top",
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={t("exercises.descriptionPlaceholder")}
              placeholderTextColor={theme.textSecondary}
              multiline
              value={customDesc}
              onChangeText={setCustomDesc}
            />

            <Text
              style={[
                typography.caption,
                { color: theme.textSecondary, marginBottom: 8 },
              ]}
            >
              {t("exercises.selectCategory")}
            </Text>

            <View style={styles.catGrid}>
              {(
                CATEGORIES.filter((c) => c !== "all") as ExerciseCategory[]
              ).map((cat) => {
                const active = customCat === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCustomCat(cat)}
                    style={[
                      styles.catChip,
                      {
                        backgroundColor: active ? theme.primary : theme.surface,
                        borderColor: active ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.caption,
                        { color: active ? "#FFFFFF" : theme.text },
                      ]}
                    >
                      {t(`exercises.categories.${cat}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleCreateCustom}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[typography.bodyBold, { color: "#FFFFFF" }]}>
                  {t("common.save")}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        ) : (
          /* Search + Category Chips + List */
          <>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={t("exercises.searchPlaceholder")}
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Horizontal Muscle Filter */}
            <View style={styles.chipsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.catChip,
                        {
                          backgroundColor: active
                            ? theme.primary
                            : theme.surface,
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: active ? "#FFFFFF" : theme.text,
                            fontWeight: active ? "700" : "500",
                          },
                        ]}
                      >
                        {cat === "all"
                          ? t("exercises.all")
                          : t(`exercises.categories.${cat}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 24,
                }}
                renderItem={({ item }) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => {
                        onSelectExercise(item);
                        onClose();
                      }}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={styles.cardRow}>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[typography.bodyBold, { color: theme.text }]}
                          >
                            {item.name[lang]}
                          </Text>
                          <Text
                            style={[
                              typography.caption,
                              { color: theme.textSecondary, marginTop: 2 },
                            ]}
                          >
                            {t(`exercises.categories.${item.category}`)}
                          </Text>
                        </View>

                        {item.isCustom && (
                          <View
                            style={[
                              styles.customBadge,
                              { backgroundColor: theme.accent + "20" },
                            ]}
                          >
                            <Text
                              style={[
                                typography.badge,
                                { color: theme.accent },
                              ]}
                            >
                              {t("exercises.customBadge")}
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                          style={styles.infoBtn}
                        >
                          <Ionicons
                            name={
                              isExpanded
                                ? "information-circle"
                                : "information-circle-outline"
                            }
                            size={22}
                            color={theme.primary}
                          />
                        </TouchableOpacity>
                      </View>

                      {isExpanded && item.description?.[lang] && (
                        <Text
                          style={[
                            typography.caption,
                            {
                              color: theme.textSecondary,
                              marginTop: 10,
                              paddingTop: 8,
                              borderTopWidth: 1,
                              borderTopColor: theme.border,
                              lineHeight: 18,
                            },
                          ]}
                        >
                          {item.description[lang]}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  iconBtn: { padding: 4 },
  searchInput: {
    height: 46,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  chipsWrapper: { marginBottom: 12 },
  chipsScroll: { paddingHorizontal: 20, gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  infoBtn: { padding: 4 },
  customForm: { paddingHorizontal: 20, paddingTop: 8 },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  saveBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
