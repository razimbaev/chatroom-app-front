import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";

const Home = () => {
  // TODO - display how many users in a room
  const websocket = React.useContext(WebSocketContext);
  websocket.loadChatroomList();
  const chatrooms = useSelector((state) => state.chatrooms);

  const chatroomCards = chatrooms.map((chatroom) => {
    return (
      <Link to={"chatroom/" + chatroom} key={chatroom}>
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{chatroom}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Put 5 most recent messages here (maybe add 3 second pause between
              updating)
            </h6>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <Row>
      <Col xs={4}></Col>
      <Col xs={4}>{chatroomCards}</Col>
      <Col xs={4}></Col>
    </Row>
  );
};

export default Home;
