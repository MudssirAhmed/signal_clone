import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Avatar } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase";
import firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                messages[messages.length - 1]?.data.photoURL ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={{ color: "white", margin: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 80,
            justifyContent: "space-between",
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  useLayoutEffect(() => {
    const unSubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timeStamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
  }, [route]);

  const sendMessage = () => {
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={110}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={{ marginTop: 10 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View style={styles.reviver}>
                    <Avatar
                      position={"absolute"}
                      bottom={-15}
                      right={-5}
                      size={30}
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      rounded
                      source={{
                        uri:
                          auth?.currentUser?.photoURL ||
                          "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
                      }}
                    />
                    <Text style={{ fontWeight: "500" }}>{data.message}</Text>
                  </View>
                ) : (
                  <View style={styles.sender}>
                    <Text style={{ color: "white", fontWeight: "500" }}>
                      {data.message}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "500",
                      }}
                    >
                      {data.displayName}
                    </Text>
                    <Avatar
                      position={"absolute"}
                      bottom={-15}
                      left={-5}
                      size={30}
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      rounded
                      source={{
                        uri:
                          data?.photoURL ||
                          "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
                      }}
                    />
                  </View>
                )
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TextInput
                placeholder="Type a message"
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    // marginBottom: 17,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  reviver: {
    position: "relative",
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    padding: 15,
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
  },
  sender: {
    position: "relative",
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    padding: 15,
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
  },
});
