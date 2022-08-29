import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { Camera } from "expo-camera";
import { Fontisto } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

const initialState = {
  title: "",
  location: "",
};

export const CreatePostsScreen = ({ navigation }) => {
  const [inputState, setInputState] = useState(initialState);
  const [camera, setCamera] = useState();
  const [photo, setPhoto] = useState();
  const [location, setLocation] = useState();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const keyboardHide = async () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync();
    setLocation(location);
    navigation.navigate("Posts");
    setInputState(initialState);
  };

  const [permission, requestPermission] = Camera.useCameraPermissions();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    requestPermission();
  }

  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    setPhoto(photo.uri);
  };

  // const reTakePhoto = () => {
  //   setPhoto();
  // };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCamera} ratio="1:1">
        {photo && (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo}></Image>
          </View>
        )}
        <View style={styles.snapContainer}>
          <TouchableOpacity onPress={takePhoto}>
            <Fontisto name="camera" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Camera>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={"Название..."}
          value={inputState.name}
          onFocus={() => setIsShowKeyboard(true)}
          onChangeText={(value) =>
            setInputState((prev) => ({ ...prev, name: value }))
          }
        />
        <View style={styles.locationInputContainer}>
          <SimpleLineIcons
            style={styles.locationIcon}
            name="location-pin"
            size={24}
            color="#BDBDBD"
          />
          <TextInput
            style={styles.locationInput}
            placeholder={"Местность..."}
            value={inputState.location}
            onFocus={() => setIsShowKeyboard(true)}
            onChangeText={(value) =>
              setInputState((prev) => ({ ...prev, location: value }))
            }
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={keyboardHide}
        activeOpacity={0.8}
        style={styles.sendButton}
      >
        <Text style={styles.buttonText}>Опубликовать</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: "relative",
    marginHorizontal: 16,
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
    height: 240,
  },
  photoContainer: {
    position: "absolute",
    flexDirection: "row",
    top: 0,
    left: 0,
  },
  photo: {
    flex: 1,
    height: 240,
  },
  snapContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 16,
    height: 51,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  form: {
    marginHorizontal: 16,
    marginTop: 48,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  locationInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  locationIcon: {
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    height: 50,
  },
  buttonText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#FFFFFF",
  },
});
