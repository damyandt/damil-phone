import {
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

interface ThemedBoxProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  safe?: boolean;
}

const ThemedBox: React.FC<ThemedBoxProps> = ({
  style,
  safe = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const baseStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.background,
    ...(safe && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
  };

  return <View style={[baseStyle, style]} {...props} />;
};

export default ThemedBox;
