import {
  Text,
  TextProps,
  TextStyle,
  StyleProp,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/Colors";

interface ThemedTextProps extends TextProps {
  title?: boolean;
  style?: StyleProp<TextStyle>;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  title = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const textColor = title ? theme.title : theme.textSecondary;

  return <Text style={[{ color: textColor }, style]} {...props} />;
};

export default ThemedText;
