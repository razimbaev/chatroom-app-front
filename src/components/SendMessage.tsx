import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";

const SendMessage = ({ chatroomName, handleOpenModal }) => {
  const userId = useSelector((state) => state.username);

  const [message, setMessage] = React.useState("");
  const websocket = useContext(WebSocketContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userId) {
      websocket.sendMessage(chatroomName, message, userId);
      setMessage("");
    } else {
      handleOpenModal();
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text className="chatroom-message-prepend">
            {userId || "<-Set Username"}
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Your Message"
          aria-label="Your Message"
          aria-describedby="basic-addon2"
          onChange={handleMessageChange}
          className="chatroom-message-input"
          value={message}
        />
        <InputGroup.Append>
          <Button type="submit" className="chatroom-message-submit">
            Send
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default SendMessage;
