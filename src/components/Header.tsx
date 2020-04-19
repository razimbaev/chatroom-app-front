import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const Header = () => {
  // TODO - see if there's a better way then to declare state here and pass it to Modal Components (maybe use redux to manage show state globally)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignupModalOpen = () => {
    setShowSignupModal(true);
  };
  const handleSignupModalClose = () => {
    setShowSignupModal(false);
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        MyChatRoom
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/chatroom/2k">
          Explore
        </Nav.Link>
        <Form inline>
          <FormControl
            type="text"
            placeholder="Search for Chatroom"
            className="mr-sm-2"
          />
        </Form>
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/chatroom/2k">
          Random Chatroom
        </Nav.Link>
        <Nav.Link as={Link} to="/chatroom/2k">
          My Chats
        </Nav.Link>
        <NavDropdown title="Account" id="basic-nav-dropdown">
          <NavDropdown.Item onClick={handleSignupModalOpen}>
            Sign Up
          </NavDropdown.Item>
          <NavDropdown.Item onClick={handleLoginModalOpen}>
            Login
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} />
      <SignupModal
        show={showSignupModal}
        handleClose={handleSignupModalClose}
      />
    </Navbar>
  );
};

export default Header;
