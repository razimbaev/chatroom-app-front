import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { useContext } from "react";
import { WebSocketContext } from "./WebSocketContext";

const SendMessage = () => {
  const userId = localStorage.getItem("userId"); // TODO - remove later and use better solution

  const [message, setMessage] = React.useState("");
  const websocket = useContext(WebSocketContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    websocket.sendMessage(message, userId);
    setMessage("");
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Your Message"
          aria-label="Your Message"
          aria-describedby="basic-addon2"
          onChange={handleChange}
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
