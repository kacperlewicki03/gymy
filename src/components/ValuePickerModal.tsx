import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../theme/typography";

interface ValuePickerModalProps {
  visible: boolean;
  title: string;
  unit: string;
  items: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
  onClose: () => void;
}

const ITEM_HEIGHT = 44;

export const ValuePickerModal: React.FC<ValuePickerModalProps> = ({
  visible,
  title,
  unit,
  items,
  selectedValue,
  onSelect,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && flatListRef.current) {
      const index = items.indexOf(selectedValue);
      if (index >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: false,
            viewPosition: 0.5,
          });
        }, 80);
      }
    }
  }, [visible, selectedValue, items]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[typography.h3, { color: theme.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
              <Text
                style={[
                  typography.bodyBold,
                  { color: theme.primary, fontSize: 16 },
                ]}
              >
                {t("common.save")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* List of scrollable values */}
          <View style={styles.listContainer}>
            <FlatList
              ref={flatListRef}
              data={items}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              renderItem={({ item }) => {
                const isSelected = item === selectedValue;
                return (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => onSelect(item)}
                    style={[
                      styles.itemRow,
                      isSelected && {
                        backgroundColor: theme.primaryMuted,
                        borderRadius: 8,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        isSelected ? typography.h3 : typography.body,
                        {
                          color: isSelected
                            ? theme.primary
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {item} {unit}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingBottom: 32,
    maxHeight: Dimensions.get("window").height * 0.48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  doneBtn: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemRow: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
});
