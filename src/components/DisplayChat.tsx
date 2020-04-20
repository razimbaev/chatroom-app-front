import React, { useRef, useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useSelector } from "react-redux";

const isVisible = (el) => {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  // Only completely visible elements return true:
  const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  // Partially visible elements return true:
  //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
  return isVisible;
};

const DisplayChat = () => {
  const [showMostRecentFooter, setShowMostRecentFooter] = useState(false);

  const chatWindow = useRef();

  const myId = localStorage.getItem("userId"); // TODO - remove later and use better solution

  const messages = useSelector((state) => state.chatroomMessages);

  messages.forEach((message) => (message.isMine = message.userId === myId));
  messages.forEach(
    (message) => (message.display = message.userId + ": " + message.content)
  );

  useEffect(() => {
    const el = chatWindow.current;
    if (el && el.children.length > 1) {
      if (
        messages[messages.length - 1].isMine ||
        (el.children.length - 4 > 0 &&
          isVisible(el.children[el.children.length - 4]))
      ) {
        setShowMostRecentFooter(false);
        el.children[el.children.length - 2].scrollIntoView();
      } else {
        setShowMostRecentFooter(true);
      }
    }
    // window.scrollTo(0, chatWindow.current.scrollHeight);
    // alert("Done");
  }, [messages]);

  const badgeMessages = messages.map((message, index) => (
    // TODO - should either use better key than index or make sure that indexes remain the same as update come from server
    <Row key={index} style={{ marginLeft: "10%", marginRight: "10%" }}>
      <Badge
        className="chat-message"
        variant={message.isMine ? "primary" : "secondary"}
      >
        {message.display}
      </Badge>
    </Row>
  ));

  const mostRecentMessage = messages &&
    messages.length > 2 &&
    !messages[messages.length - 1].isMine && (
      <div
        hidden={!showMostRecentFooter}
        style={{
          width: "100%",
          backgroundColor: "PaleTurquoise",
          paddingTop: "5px",
          paddingBottom: "5px",
          position: "sticky",
          bottom: "0px",
        }}
      >
        <Row
          style={{
            marginLeft: "10%",
            marginRight: "10%",
          }}
        >
          <Badge className="chat-message" variant="secondary">
            {messages[messages.length - 1].display}
          </Badge>
        </Row>
      </div>
    );

  const handleScroll = () => {
    if (
      isVisible(
        chatWindow.current.children[chatWindow.current.children.length - 2]
      )
    )
      setShowMostRecentFooter(false);
  };

  return (
    <div
      style={{ position: "relative" }}
      className="chatroom-messages"
      onScroll={handleScroll}
    >
      <div ref={chatWindow}>
        {badgeMessages}
        {mostRecentMessage}
      </div>
    </div>
  );
};

export default DisplayChat;
