import React, { useRef, useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

const isVisible = (el) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  return isVisible;
};

const DisplayChat = () => {
  const [showMostRecentFooter, setShowMostRecentFooter] = useState(false);
  const [isInitScrolledToTop, setIsInitScrolledToTop] = useState(false);
  const chatWindow = useRef();
  const messages = useSelector((state) => state.chatroomMessages);

  const myId = useSelector((state) => state.username);

  // TODO - move this logic into reducer
  messages.forEach((message) => (message.isMine = message.userId === myId));
  messages.forEach(
    (message) => (message.display = message.userId + ": " + message.content)
  );

  const scrollToBottom = () => {
    const el = chatWindow.current;
    el.children[el.children.length - 2].scrollIntoView();
    setShowMostRecentFooter(false);
  };

  useEffect(() => {
    const el = chatWindow.current;

    if (!messages || messages.length === 0) {
      setIsInitScrolledToTop(false);
    }

    if (!isInitScrolledToTop && messages && messages.length > 1) {
      scrollToBottom();
      setIsInitScrolledToTop(true);
    }

    if (el && el.children.length > 1) {
      if (
        messages[messages.length - 1].isMine ||
        (el.children.length - 4 > 0 &&
          isVisible(el.children[el.children.length - 4]))
      ) {
        scrollToBottom();
      } else {
        if (messages.length > 4) setShowMostRecentFooter(true);
      }
    }
  }, [messages]);

  const badgeMessages = messages.map((message, index) => (
    // TODO - should either use better key than index or make sure that indexes remain the same as update come from server
    <Row key={index} className="message-margins">
      <Badge
        className="chat-message"
        variant={message.isMine ? "primary" : "secondary"}
      >
        {message.display}
      </Badge>
    </Row>
  ));

  const handleClickMostRecentMessageNotification = () => {
    scrollToBottom();
  };

  const mostRecentMessageNotification = messages &&
    messages.length > 2 &&
    !messages[messages.length - 1].isMine && (
      <a>
        <div
          hidden={!showMostRecentFooter}
          className="most-recent-message-notification"
          onClick={handleClickMostRecentMessageNotification}
        >
          <Row className="message-margins">
            <Badge className="chat-message" variant="secondary">
              {messages[messages.length - 1].display}
            </Badge>
          </Row>
        </div>
      </a>
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
    <div className="chatroom-messages" onScroll={handleScroll}>
      <div ref={chatWindow}>
        {badgeMessages}
        {mostRecentMessageNotification}
      </div>
    </div>
  );
};

export default DisplayChat;
