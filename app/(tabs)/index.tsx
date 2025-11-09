import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useColorScheme,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import ThemedView from "../../components/newThemedView";
import ThemedBox from "../../components/ThemedBox";
import ThemedText from "../../components/ThemedText";

type ClassItem = {
  title: string;
  date: string;
  duration: string;
  location: string;
  spots: number;
};

type TabKey = "upcoming" | "booked";

const MembersHome: React.FC = () => {
  const tabAnim = useState(new Animated.Value(0))[0]; // 0 = Upcoming, 1 = Booked
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleTabPress = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    Animated.timing(tabAnim, {
      toValue: tabKey === "upcoming" ? 0 : 1,
      duration: 300,
      useNativeDriver: false, // cannot animate backgroundColor with native driver
    }).start();
  };

  const upcomingBg = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.background, theme.oppositeBG],
  });

  const bookedBg = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.oppositeBG, theme.background],
  });

  const upcomingText = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.textPrimary, theme.textOppositePrimary],
  });

  const bookedText = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.textOppositePrimary, theme.textPrimary],
  });

  const classes: ClassItem[] = [
    {
      title: "Cardio Class",
      date: "Sat, Apr 11 at 8:00 PM",
      duration: "60 min",
      location: "Home Location",
      spots: 11,
    },
    {
      title: "Ashtanga Yoga",
      date: "Sat, Apr 11 at 9:00 PM",
      duration: "60 min",
      location: "Home Location",
      spots: 12,
    },
    {
      title: "Cardio Class",
      date: "Sat, Apr 11 at 8:00 PM",
      duration: "60 min",
      location: "Home Location",
      spots: 10,
    },
    {
      title: "Cardio Class",
      date: "Sat, Apr 11 at 8:00 PM",
      duration: "60 min",
      location: "Home Location",
      spots: 15,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.container]}
      style={{ backgroundColor: theme.background }}
    >
      <ThemedBox style={styles.content}>
        {/* News Section */}
        <View>
          <ThemedBox style={styles.sectionHeader}>
            <ThemedText title style={styles.sectionHeaderText}>
              News
            </ThemedText>
          </ThemedBox>

          <View style={styles.newsContainer}>
            {[1, 2].map((_, i) => (
              <ThemedView key={i} style={styles.newsCard}>
                <View style={styles.newsTitleContainer}>
                  <View style={styles.newsAndIcon}>
                    <Ionicons name="book" size={16} color="#888" />
                    <ThemedText title style={styles.newsTitle}>
                      News
                    </ThemedText>
                  </View>

                  <View style={styles.newsAndIcon}>
                    <ThemedText style={styles.newsTitle}>
                      Seconds ago...
                    </ThemedText>
                    <Ionicons name="close" size={16} color="#888" />
                  </View>
                </View>
                <ThemedText>
                  {i === 0
                    ? "Start working out to boost your fitness level!"
                    : "2 more classes and you will reach level 4!"}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        </View>

        {/* Classes Section */}
        <View>
          <View style={styles.sectionHeader}>
            <ThemedText title style={styles.sectionHeaderText}>
              Classes
            </ThemedText>
          </View>

          <ThemedView
            style={[styles.tabs, { backgroundColor: theme.oppositeSurface }]}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => handleTabPress("upcoming")}
            >
              <Animated.View
                style={[styles.tab, { backgroundColor: upcomingBg, flex: 1 }]}
              >
                <Animated.Text style={{ color: upcomingText }}>
                  Upcoming
                </Animated.Text>
              </Animated.View>
            </Pressable>

            <Pressable
              style={{ flex: 1 }}
              onPress={() => handleTabPress("booked")}
            >
              <Animated.View
                style={[styles.tab, { backgroundColor: bookedBg, flex: 1 }]}
              >
                <Animated.Text style={{ color: bookedText }}>
                  Booked
                </Animated.Text>
              </Animated.View>
            </Pressable>
          </ThemedView>

          <ThemedBox style={styles.grid}>
            {activeTab === "upcoming" ? (
              classes.map((cls, index) => (
                <ThemedView key={index} style={styles.card}>
                  <View style={{ gap: 10 }}>
                    <View style={styles.row}>
                      <Ionicons name="today" size={16} color="#888" />
                      <ThemedText style={styles.date}>{cls.date}</ThemedText>
                    </View>
                    <ThemedText title style={styles.title}>
                      {cls.title}
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                      {cls.duration} • {cls.location}
                    </ThemedText>
                  </View>

                  <View>
                    <ThemedText>{cls.spots} Spots Left</ThemedText>
                  </View>
                </ThemedView>
              ))
            ) : (
              <ThemedBox style={styles.noClassesContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={theme.textPrimary}
                  style={{ marginBottom: 12 }}
                />
                <ThemedText style={styles.noClassesText}>
                  You haven’t booked any classes yet!
                </ThemedText>
                <ThemedText style={styles.noClassesSubText}>
                  Explore upcoming classes and reserve your spot.
                </ThemedText>
              </ThemedBox>
            )}
          </ThemedBox>
        </View>
      </ThemedBox>
    </ScrollView>
  );
};

export default MembersHome;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
    minHeight: "100%",
  },

  newsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },
  newsCard: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  newsTitle: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  newsAndIcon: {
    textAlign: "center",
    display: "flex",
    gap: 10,
    flexDirection: "row",
  },
  newsTitleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionHeader: {
    marginVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  card: {
    width: "100%",
    marginBottom: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },

  tabs: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    padding: 2,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    alignItems: "center",
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 10,
  },
  noClassesContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  noClassesText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  noClassesSubText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
