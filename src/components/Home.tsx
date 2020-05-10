import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, Redirect } from "react-router-dom";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import CreateNewChatroomModal from "./CreateNewChatroomModal";
import Button from "react-bootstrap/Button";

const Home = () => {
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    setRedirect("");
  }, []);

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

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const getRandomChatroom = () => {
    const chatroomsToJoin = Object.keys(homepageData);
    const randomIndex = Math.floor(Math.random() * chatroomsToJoin.length);
    return chatroomsToJoin[randomIndex];
  };

  const joinRandomChatroom = () => {
    const randomChatroom = getRandomChatroom();
    setRedirect(randomChatroom);
  };

  if (redirect) {
    return <Redirect to={"/chatroom/" + redirect} />;
  }

  const createNewChatroomButton = (
    <Row>
      <Col xs={6}>
        <Row>
          <Col xs={3}></Col>
          <Col xs={8} className="create-chatroom-button-align-left">
            <Button
              variant="outline-light"
              className="create-chatroom"
              onClick={joinRandomChatroom}
            >
              Join Random
            </Button>
          </Col>
          <Col xs={1} />
        </Row>
      </Col>
      <Col xs={6}>
        <Row>
          <Col xs={1} />
          <Col xs={8} className="create-chatroom-button-align-right">
            <Button
              variant="outline-light"
              className="create-chatroom"
              onClick={openModal}
            >
              + Create New Chatroom
            </Button>
          </Col>
          <Col xs={3} />
        </Row>
      </Col>
    </Row>
  );

  return (
    <div>
      {createNewChatroomButton}
      {rows}
      <CreateNewChatroomModal show={showModal} handleClose={closeModal} />
    </div>
  );
};

export default Home;
