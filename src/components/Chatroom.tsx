import React, { useEffect, useState } from "react";
import DisplayChat from "./DisplayChat";
import SendMessage from "./SendMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DisplayChatUsers from "./DisplayChatUsers";
import { WebSocketContext } from "./WebSocketContext";
import ChangeUsernameModal from "./ChangeUsernameModal";

const Chatroom = (props) => {
  const chatroomName = props.match.params.chatroomName;
  const websocket = React.useContext(WebSocketContext);

  useEffect(() => {
    websocket.loadChatroomPage(chatroomName);
  }, [chatroomName]);

  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="page chatroom">
      <h1 className="chatroom-title dynamic-chatroom-title-font">
        {chatroomName}
      </h1>
      <Row className="chatroom-body">
        <Col xs={2} className="chatroom-cols">
          <DisplayChatUsers handleOpenModal={handleOpenModal} />
        </Col>
        <Col xs={10} className="chatroom-cols">
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
