import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" className="header-bar">
      <Navbar.Brand as={Link} to="/">
        MyChatRoom
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">
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
        <Nav.Link as={Link} to="/">
          Random Chatroom
        </Nav.Link>
        <Nav.Link as={Link} to="/">
          My Chats
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Header;
