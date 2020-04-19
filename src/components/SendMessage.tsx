import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { useContext } from "react";
import { WebSocketContext } from "./WebSocketContext";

const SendMessage = ({ chatroomName }) => {
  const userId = localStorage.getItem("userId"); // TODO - remove later and use better solution

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

  const [username, setUsername] = React.useState(userId);
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const [editUsernameMode, setEditUsernameMode] = React.useState(!username);
  const [usernameFocused, setUsernameFocused] = React.useState(
    editUsernameMode
  );

  // TODO - fix bug where two open tabs use different usernames (uses localstorage as username to post but display will be different)
  // TODO - allow username to be enter by also pressing enter (and update below states accordingly)
  const enableEditUsernameMode = () => {
    setEditUsernameMode(true);
  };
  const disableEditUsernameMode = () => {
    // TODO - check if username is valid
    if (!usernameFocused) setEditUsernameMode(false);
  };

  const focusUsername = () => {
    setUsernameFocused(true);
  };
  const blurUsername = () => {
    setUsernameFocused(false);
    setEditUsernameMode(false); // TODO - figure out why this works but not disableEditUsernameMode();
    localStorage.setItem("userId", username);
    websocket.updateUsername(username);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <InputGroup.Prepend
          onMouseEnter={enableEditUsernameMode}
          onMouseLeave={disableEditUsernameMode}
          onFocus={focusUsername}
          onBlur={blurUsername}
        >
          {editUsernameMode && (
            <FormControl
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon2"
              onChange={handleUsernameChange}
              value={username}
            />
          )}
          {!editUsernameMode && (
            <InputGroup.Text id="basic-addon1">{username}</InputGroup.Text>
          )}
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
