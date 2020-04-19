import React from "react";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

const DisplayChat = () => {
  const myId = localStorage.getItem("userId"); // TODO - remove later and use better solution

  const messages = useSelector((state) => state.chatroomMessages);

  messages.forEach((message) => (message.isMine = message.userId === myId));
  messages.forEach(
    (message) => (message.display = message.userId + ": " + message.content)
  );
  const badgeMessages = messages.map((message, index) => (
    // TODO - should either use better key than index or make sure that indexes remain the same as update come from server
    <Row key={index}>
      <Col xs={5}>
        {!message.isMine && (
          <Badge variant="secondary">{message.display}</Badge>
        )}
      </Col>
      <Col xs={2}> </Col>
      <Col xs={5}>
        {message.isMine && <Badge variant="primary">{message.display}</Badge>}
      </Col>
    </Row>
  ));

  return <Container>{badgeMessages}</Container>;
};

export default DisplayChat;
