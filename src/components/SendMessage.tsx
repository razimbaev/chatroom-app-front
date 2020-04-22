import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { useContext } from "react";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";

const SendMessage = ({ chatroomName }) => {
  const userId = useSelector((state) => state.username);

  const [message, setMessage] = React.useState("");
  const websocket = useContext(WebSocketContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    websocket.sendMessage(chatroomName, message, userId);
    setMessage("");
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>{userId || "<-Set Username"}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Your Message"
          aria-label="Your Message"
          aria-describedby="basic-addon2"
          onChange={handleMessageChange}
          value={message}
        />
        <InputGroup.Append>
          <Button type="submit" variant="outline-secondary">
            Send
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default SendMessage;
