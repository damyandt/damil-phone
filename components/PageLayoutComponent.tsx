import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { ReactNode } from "react";
import ThemedView from "./newThemedView";
import Spacer from "./Spacer";
import { Colors } from "../constants/Colors";
import ThemedBox from "./ThemedBox";

type PageLayoutComponentProps = {
  children: ReactNode;
  subTitle: string;
  title: string;
};

const PageLayoutComponent = ({
  children,
  subTitle,
  title,
}: PageLayoutComponentProps) => {
  const colorScheme: any = useColorScheme();
  const theme = Colors[colorScheme];
  return (
    <ThemedView
      style={[styles.screen, { backgroundColor: theme.layoutBackground }]}
    >
      <Spacer
        height={100}
        style={{ backgroundColor: theme.layoutBackground }}
      />
      <View
        style={[styles.header, { backgroundColor: theme.layoutBackground }]}
      >
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={{ fontSize: 14, color: Colors.text.light }}>
            {subTitle}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>D</Text>
        </View>
      </View>

      <Spacer height={50} style={{ backgroundColor: theme.layoutBackground }} />

      <View style={[styles.shadowWrapper, Colors.dark.shadow]}>
        <ThemedBox style={[styles.contentContainer]}>{children}</ThemedBox>
      </View>
    </ThemedView>
  );
};

export default PageLayoutComponent;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 53,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.light,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  shadowWrapper: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "transparent",
  },
});
