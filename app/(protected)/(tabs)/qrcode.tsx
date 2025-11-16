import {
  Image,
  ScrollView,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";
import ThemedBox from "../../../components/ThemedBox";
import ThemedText from "../../../components/ThemedText";
import { Colors } from "../../../constants/Colors";
import PageLayoutComponent from "../../../components/PageLayoutComponent";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getQrCode } from "../../../API/queries/auth/apiAuthGetQueries";
import callApi from "../../../API/callApi";

const QRcode: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { setAuthedUser, authedUser } = useContext(AuthContext);
  const role = authedUser?.roles?.[0];
  const [qrCode, setQrcode] = useState<any>();
  const fetchQRCode = async () => {
    try {
      const blob = await callApi<Blob>({
        query: getQrCode(authedUser?.id!),
        auth: { setAuthedUser },
      });

      // Convert blob → base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrcode(reader.result); // base64 string
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    role === "Member" && fetchQRCode();
  }, [authedUser]);
  if (role === "Member") {
    return (
      <PageLayoutComponent
        title="QR Code"
        subTitle="Need this to join the training!"
      >
        <ScrollView
          contentContainerStyle={styles.container as ViewStyle}
          style={{ backgroundColor: theme.background }}
        >
          <ThemedBox style={styles.container}>
            <ThemedBox
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {qrCode ? (
                <Image
                  source={{ uri: qrCode }}
                  style={{
                    width: "90%",
                    aspectRatio: 1,
                    borderRadius: 20,
                    alignSelf: "center",
                  }}
                  resizeMode="contain"
                />
              ) : (
                <ThemedText
                  style={{
                    width: "100%",
                    height: "100%",
                    alignSelf: "center",
                    textAlign: "center",
                    display: "flex",
                    alignContent: "center",
                  }}
                >
                  Loading QR...
                </ThemedText>
              )}
            </ThemedBox>
          </ThemedBox>
        </ScrollView>
      </PageLayoutComponent>
    );
  }
  return (
    <PageLayoutComponent
      title="Scann QR Code"
      subTitle="Scann to see subscription!"
    >
      <ScrollView
        contentContainerStyle={styles.container as ViewStyle}
        style={{ backgroundColor: theme.background }}
      >
        <ThemedBox style={styles.container}>
          <ThemedText>QRcode</ThemedText>
        </ThemedBox>
      </ScrollView>
    </PageLayoutComponent>
  );
};

export default QRcode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
