import React from "react";
import Routes from "./components/Routes";
import WebSocketProvider from "./components/WebSocketContext";
import "./index.css";

const App = () => {
  return (
    <WebSocketProvider>
      <Routes />
    </WebSocketProvider>
  );
};

export default App;
