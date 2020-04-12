import React from "react";
import DisplayChat from "./components/DisplayChat";
import SendMessage from "./components/SendMessage";
import WebSocketProvider from "./components/WebSocketContext";

const App = () => {
  // hacky solution (replace with better one)
  const myIdStore = "userId";
  if (localStorage.getItem(myIdStore) === null) {
    localStorage.setItem(myIdStore, Math.random() + "");
  }

  return (
    <WebSocketProvider>
      <DisplayChat />
      <br />
      <br />
      <SendMessage />
    </WebSocketProvider>
  );
};

export default App;
