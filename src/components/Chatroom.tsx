import React, { useEffect, useState } from "react";
import DisplayChat from "./DisplayChat";
import SendMessage from "./SendMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DisplayChatUsers from "./DisplayChatUsers";
import { WebSocketContext } from "./WebSocketContext";
import { useDispatch } from "react-redux";
import { setChatroom } from "../redux/actions/messageActions";
import ChangeUsernameModal from "./ChangeUsernameModal";

const Chatroom = (props) => {
  const chatroomName = props.match.params.chatroomName;
  const dipatch = useDispatch();
  const websocket = React.useContext(WebSocketContext);
  let unsubscribe;

  useEffect(() => {
    dipatch(setChatroom(chatroomName));
    unsubscribe = websocket.subscribeChatroom(chatroomName);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatroomName]);

  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="chatroom">
      <h1 className="chatroom-title">{chatroomName}</h1>
      <Row>
        <Col xs={2}>
          <DisplayChatUsers handleOpenModal={handleOpenModal} />
        </Col>
        <Col xs={10}>
          <DisplayChat />
          <SendMessage
            chatroomName={chatroomName}
            handleOpenModal={handleOpenModal}
          />
        </Col>
      </Row>
      <ChangeUsernameModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Chatroom;
