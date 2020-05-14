import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const MyChats = () => {
  const websocket = React.useContext(WebSocketContext);

  useEffect(() => {
    // TODO - not scalable as more homepage data is created so think about pagination
    websocket.loadMyChatsPage();
  }, []);

  const homepageData = useSelector((state) => state.homepageData);
  const myChatroomNames = useSelector((state) => state.myChatrooms);

  const chatroomCards = myChatroomNames.map((chatroom) => {
    const numUsers = homepageData[chatroom].numUsers;
    const mostRecentMessages = homepageData[chatroom].mostRecentMessages;

    return (
      <div key={chatroom}>
        <br />
        <Link to={"chatroom/" + chatroom}>
          <Card border="dark" className="home-card">
            <Card.Header className="home-card-header">
              <p className="home-chatroom-name">{chatroom}</p>
              <p className="home-active-users">{numUsers} active users</p>
            </Card.Header>
            <Card.Body className="home-card-body">
              {mostRecentMessages.map((messageInfo, index) => {
                return (
                  <Card.Text key={index} className="home-card-body-content">
                    {messageInfo.userId} : {messageInfo.content}
                  </Card.Text>
                );
              })}
            </Card.Body>
          </Card>
        </Link>
      </div>
    );
  });

  return (
    <Row className="page">
      <Col xs={4}></Col>
      <Col xs={4}>{chatroomCards}</Col>
      <Col xs={4}></Col>
    </Row>
  );
};

export default MyChats;
