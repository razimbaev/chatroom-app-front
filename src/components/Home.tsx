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
          <Card border="dark">
            <Card.Header style={{ paddingBottom: "0px" }}>
              <p style={{ float: "left", color: "black" }}>{chatroom}</p>
              <p style={{ float: "right", color: "darkblue" }}>
                {numUsers} active users
              </p>
            </Card.Header>
            <Card.Body
              style={{
                marginBottom: "0px",
                marginTop: "0px",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              {mostRecentMessages.map((messageInfo, index) => {
                return (
                  <Card.Text
                    key={index}
                    style={{
                      color: "gray",
                      marginBottom: "0px",
                      marginTop: "0px",
                      paddingBottom: "0px",
                      paddingTop: "0px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
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

  return (
    <Row>
      <Col xs={4}></Col>
      <Col xs={4}>{chatroomCards}</Col>
      <Col xs={4}></Col>
    </Row>
  );
};

export default Home;
