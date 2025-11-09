import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

interface ThemedViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  /** Whether to apply safe area padding automatically */
  safe?: boolean;
}

const ThemedView: React.FC<ThemedViewProps> = ({
  style,
  safe = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  if (!safe) {
    return (
      <View style={[{ backgroundColor: theme.surface }, style]} {...props} />
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;
