import React, { useState, useRef, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { WebSocketContext } from "./WebSocketContext";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const CreateNewChatroomModal = (props) => {
  const [newChatroomName, setNewChatroomName] = useState("");
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const newChatroomField = useRef();
  const homepageData = useSelector((state) => state.homepageData);
  const websocket = useContext(WebSocketContext);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    setRedirect("");
  }, []);

  useEffect(() => {
    if (props.show && newChatroomField && newChatroomField.current)
      newChatroomField.current.focus();
  }, [props.show]);

  const isValidChatroomName = (chatroomNameValue) => {
    if (!chatroomNameValue) return false;

    if (Object.prototype.hasOwnProperty.call(homepageData, chatroomNameValue))
      return false;

    const regex = new RegExp("^[a-zA-Z0-9_-]{3,30}$");
    return regex.test(chatroomNameValue);
  };

  const handleChange = (event) => {
    setNewChatroomName(event.target.value);
    setErrorMessage("");
    const isValid = isValidChatroomName(event.target.value);
    setValidated(isValid);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validated) return;
    websocket.createNewChatroom(
      newChatroomName,
      (errorMessage) => {
        setErrorMessage(errorMessage);
      },
      () => {
        setRedirect("/chatroom/" + newChatroomName);
      }
    );
  };

  const className = validated ? "" : "invalid-textbox";

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formChatroomName">
            <Form.Control
              type="text"
              placeholder="Enter new chatroom name here"
              value={newChatroomName}
              onChange={handleChange}
              className={className}
              ref={newChatroomField}
            />
            <Form.Text className="text-muted">
              Chatroom Names must be unique and must be between 3 and 30
              characters and must only contain [a-z][A-Z][0-9]-_
            </Form.Text>
          </Form.Group>

          <div className="text-align-center">
            <span className="error-message">{errorMessage}</span>
          </div>
          <br />
          <Button
            variant="outline-light"
            className="create-chatroom"
            type="submit"
            disabled={!validated}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateNewChatroomModal;
