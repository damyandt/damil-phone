import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";
import ThemedBox from "../../components/ThemedBox";
import ThemedText from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";

const QRcode: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      contentContainerStyle={styles.container as ViewStyle}
      style={{ backgroundColor: theme.background }}
    >
      <ThemedBox style={styles.container}>
        <ThemedText>QRcode</ThemedText>
      </ThemedBox>
    </ScrollView>
  );
};

export default QRcode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
