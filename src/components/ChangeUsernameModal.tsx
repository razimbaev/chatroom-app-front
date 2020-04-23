import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import { WebSocketContext } from "./WebSocketContext";

const ChangeUsernameModal = (props) => {
  const currentUsername = useSelector((state) => state.username);
  const [username, setUsername] = useState(currentUsername);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const usernameField = useRef();
  const websocket = useContext(WebSocketContext);

  useEffect(() => {
    if (props.show && usernameField && usernameField.current)
      usernameField.current.focus();
  }, [props.show]);

  useEffect(() => {
    setUsername(currentUsername); // fixes issue where when loaded username is initialized to null
  }, [currentUsername]);

  const isValidUsername = (usernameValue) => {
    if (usernameValue === currentUsername) return false;
    if (username) {
      const regex = new RegExp("^[a-zA-Z0-9_-]{3,20}$");
      return regex.test(usernameValue);
    }
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
    setErrorMessage("");
    const isValid = isValidUsername(event.target.value);
    setValidated(isValid);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validated) return;
    websocket.updateUsername(username, (errorMessage) => {
      setErrorMessage(errorMessage);
    });
  };

  useEffect(() => {
    props.handleClose();
  }, [currentUsername]);

  const className = validated ? "" : "invalid-textbox";

  const setUsernameBeforeSendMessageWarning = (
    <div className="text-align-center">
      <Form.Text className="error-message">
        You must specify username before you can send message in chatroom
      </Form.Text>
      <br />
    </div>
  );

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {currentUsername ? "" : setUsernameBeforeSendMessageWarning}
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Enter new username here"
              value={username}
              onChange={handleChange}
              className={className}
              ref={usernameField}
            />
            <Form.Text className="text-muted">
              Usernames must be unique and must be between 3 and 20 characters
              and must only contain [a-z][A-Z][0-9]-_ (Usernames can only be
              changed once every 24 hours)
            </Form.Text>
          </Form.Group>

          <div className="text-align-center">
            <span className="error-message">{errorMessage}</span>
          </div>
          <br />
          <Button variant="outline-primary" type="submit" disabled={!validated}>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeUsernameModal;
