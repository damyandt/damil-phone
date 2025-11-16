import {
  Alert,
  Image,
  Modal,
  Pressable,
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
import QRScanner from "../../../components/camera/Scanner";
import ThemedView from "../../../components/newThemedView";
import { getMember } from "../../../API/queries/auth/scanner/apiScannerGetQueries";
import { User } from "../../../API/types/authTypes";
import { Response } from "../../../API/types/commonTypes";

const QRcode: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { setAuthedUser, authedUser } = useContext(AuthContext);
  const [userModal, setUserModal] = useState<boolean>(false);
  const role = authedUser?.roles?.[0];
  const [qrCode, setQrcode] = useState<any>();

  const fetchQRCode = async () => {
    try {
      const blob = await callApi<Blob>({
        query: getQrCode(authedUser?.id!),
        auth: { setAuthedUser },
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setQrcode(reader.result);
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
  const [scannerActive, setScannerActive] = useState(true);
  const [userInfo, setUserInfo] = useState<Partial<User>>();
  const [loadUserInfo, setLoadUserInfo] = useState<boolean>(false);
  const fetchUser = async (value: string) => {
    setLoadUserInfo(true);
    try {
      const response = await callApi<Response<User[]>>({
        query: getMember(value, "qrToken"),
        auth: { setAuthedUser },
      });
      setUserInfo(response?.data?.[0]);
      console.log(response?.data?.[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadUserInfo(false);
    }
  };
  let scanning = false;
  const handleScan = (value: string) => {
    if (scanning) return; // ignore duplicates
    scanning = true;

    fetchUser(value);
    setScannerActive(false);
    setUserModal(true);
  };

  const closeModal = () => {
    setUserModal(false);
    setScannerActive(true);
    scanning = false;
  };
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
          <QRScanner onScanned={handleScan} resetScan={scannerActive} />
        </ThemedBox>

        <Modal
          animationType="slide"
          transparent={true}
          visible={userModal}
          onRequestClose={closeModal}
        >
          {loadUserInfo ? (
            <ThemedView style={styles.modalOverlay}>
              <ThemedView style={styles.modalView}>
                <ThemedText>Loading...</ThemedText>
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedView style={styles.modalOverlay}>
              <ThemedView style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>
                  {userInfo?.firstName} {userInfo?.lastName}
                </ThemedText>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>Имейл</ThemedText>
                  <ThemedText style={styles.value}>
                    {userInfo?.email || "N/A"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>Телефон</ThemedText>
                  <ThemedText style={styles.value}>
                    {userInfo?.phone || "N/A"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>Пол</ThemedText>
                  <ThemedText style={styles.value}>
                    {userInfo?.gender}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>Абонаментен план</ThemedText>
                  <ThemedText style={styles.value}>
                    {userInfo?.subscriptionPlan || "N/A"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>
                    Статус на абонамента
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.subscriptionStatus,
                      userInfo?.subscriptionStatus === "ACTIVE"
                        ? styles.activeStatus
                        : styles.inactiveStatus,
                    ]}
                  >
                    {userInfo?.subscriptionStatus === "ACTIVE"
                      ? "Активен"
                      : "Неактивен"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>Начална дата</ThemedText>
                  <ThemedText style={styles.value}>
                    {userInfo?.subscriptionStartDate
                      ? new Date(
                          userInfo.subscriptionStartDate
                        ).toLocaleDateString("bg-BG")
                      : "N/A"}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.label}>Крайна дата</ThemedText>
                  <ThemedText style={styles.value}>
                    {userInfo?.subscriptionEndDate
                      ? new Date(
                          userInfo.subscriptionEndDate
                        ).toLocaleDateString("bg-BG")
                      : "N/A"}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.buttonsContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={closeModal}
                  >
                    <ThemedText style={styles.buttonCloseText}>
                      Close
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonCheckIn]}
                    onPress={closeModal}
                  >
                    <ThemedText style={styles.textStyle}>Check In</ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          )}
        </Modal>
      </ScrollView>
    </PageLayoutComponent>
  );
};

export default QRcode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.51)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    height: 400,
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    alignSelf: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontWeight: "400",
    color: "#111",
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff", // white text for blue button
  },

  buttonCloseText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#111", // dark text for light button
  },

  subscriptionStatus: {
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    textAlign: "center",
  },
  activeStatus: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  inactiveStatus: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  buttonsContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 3,
  },

  buttonClose: {
    backgroundColor: "#e0e0e0", // light gray
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  buttonCheckIn: {
    backgroundColor: "#2196F3", // blue
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
