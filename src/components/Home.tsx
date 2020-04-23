import React, { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";

const Home = () => {
  const websocket = React.useContext(WebSocketContext);
  let unsubscribe;

  useEffect(() => {
    unsubscribe = websocket.loadHomepageData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const homepageData = useSelector((state) => state.homepageData);

  const chatroomCards = [];

  for (const chatroom of Object.keys(homepageData)) {
    const numUsers = homepageData[chatroom].numUsers;
    const mostRecentMessages = homepageData[chatroom].mostRecentMessages;

    chatroomCards.push(
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
  }

  const halfLength = Math.ceil(chatroomCards.length / 2);
  const right = chatroomCards;
  const left = chatroomCards.splice(0, halfLength);

  const rows = left.map((leftCard, index) => {
    return (
      <Row key={index}>
        <Col xs={6}>
          <Row>
            <Col xs={3}></Col>
            <Col xs={8}>{leftCard}</Col>
            <Col xs={1} />
          </Row>
        </Col>
        <Col xs={6}>
          <Row>
            <Col xs={1} />
            <Col xs={8}>{index < right.length ? right[index] : null}</Col>
            <Col xs={3} />
          </Row>
        </Col>
      </Row>
    );
  });

  return <div>{rows}</div>;
};

export default Home;
