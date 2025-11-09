import {
  View,
  ViewStyle,
  StyleProp,
  useColorScheme,
  DimensionValue,
} from "react-native";
import { Colors } from "../constants/Colors";

interface SpacerProps {
  width?: DimensionValue;
  height?: number;
  box?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Spacer: React.FC<SpacerProps> = ({
  width = "100%",
  height = 40,
  box = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const bgColor = box ? theme.surface : theme.background;

  return (
    <View
      style={[
        { width: width as DimensionValue, height, backgroundColor: bgColor },
        style,
      ]}
    />
  );
};

export default Spacer;
