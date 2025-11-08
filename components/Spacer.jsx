import { useColorScheme, View } from "react-native";
import { Colors } from "../constants/Colors";

const Spacer = ({ width = "100%", height = 40, box = false, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const bgColor = box ? theme.surface : theme.background;
  return <View style={[{ width, height, backgroundColor: bgColor }, style]} />;
};

export default Spacer;
