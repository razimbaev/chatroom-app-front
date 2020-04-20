import React, { useEffect } from "react";
import DisplayChat from "./DisplayChat";
import SendMessage from "./SendMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DisplayChatUsers from "./DisplayChatUsers";
import { WebSocketContext } from "./WebSocketContext";
import { useDispatch } from "react-redux";
import { setChatroom } from "../redux/actions/messageActions";

const Chatroom = (props) => {
  const chatroomName = props.match.params.chatroomName;
  const dipatch = useDispatch();
  dipatch(setChatroom(chatroomName));
  const websocket = React.useContext(WebSocketContext);

  useEffect(() => {
    websocket.subscribeChatroom(chatroomName);
  }, [chatroomName]);

  return (
    <div className="chatroom">
      <h1 className="chatroom-title">{chatroomName}</h1>
      <Row>
        <Col xs={10}>
          <div>
            <DisplayChat />
          </div>
          <SendMessage chatroomName={chatroomName} />
        </Col>
        <Col xs={2}>
          <DisplayChatUsers />
        </Col>
      </Row>
    </div>
  );
};

export default Chatroom;
