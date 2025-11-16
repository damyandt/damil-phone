import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
export default function QRScanner({
  onScanned,
  resetScan = false, // new prop
}: {
  onScanned: (value: string) => void;
  resetScan?: boolean;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Reset scanned state when resetScan changes
  useEffect(() => {
    if (resetScan) setScanned(false);
  }, [resetScan]);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Text onPress={requestPermission} style={styles.link}>
          Grant Permission
        </Text>
      </View>
    );
  }

  return (
    <CameraView
      style={styles.camera}
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={(data) => {
        if (!scanned) {
          setScanned(true);
          onScanned(data.data);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 10,
    color: "blue",
  },
});
