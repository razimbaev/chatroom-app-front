import React from "react";
import Routes from "./components/Routes";
import WebSocketProvider from "./components/WebSocketContext";

const App = () => {
  return (
    <WebSocketProvider>
      <Routes />
    </WebSocketProvider>
  );
};

export default App;
