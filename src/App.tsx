import React from "react";
import Routes from "./components/Routes";
import WebSocketProvider from "./components/WebSocketContext";
import "./index.css";

const App = () => {
  // return (
  //   <div className="talk-bubble tri-right round right-in">
  //     <div className="talktext">
  //       <p>
  //         CSS Talk Bubble configured by classes. Defaults to square shape, no
  //         triangle. Height is auto-adjusting to the height of the text.
  //       </p>
  //     </div>
  //   </div>
  // );
  return (
    <WebSocketProvider>
      <Routes />
    </WebSocketProvider>
  );
};

export default App;
