import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { WebSocketContext } from "./WebSocketContext";
import { faEarlybirds } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ setRedirect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const websocket = useContext(WebSocketContext);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFocus = () => {
    setSearchValue(" ");
    setSearchValue(""); // hacky way to make suggestions show on focus
    websocket.getChatroomSuggestions((suggestionResults) => {
      setSuggestions(suggestionResults);
    });
  };

  const handleBlur = () => {
    setSearchValue("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (suggestions.indexOf(searchValue) !== -1) {
      setRedirect(searchValue);
      setSearchValue("");
    }
  };

  return (
    <Navbar className="header-bar">
      <Navbar.Brand as={Link} to="/">
        <FontAwesomeIcon icon={faEarlybirds}/> JibbrJabbr
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/explore" className="navbar-text">
          Explore
        </Nav.Link>
        <Form inline onSubmit={handleSubmit}>
          <FormControl
            type="text"
            placeholder="Search for Chatroom"
            className="mr-sm-2 search-bar"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={searchValue}
            list="suggestions"
          />
          <datalist id="suggestions">
            {suggestions.map((suggestion) => {
              return <option key={suggestion} value={suggestion} />;
            })}
          </datalist>
        </Form>
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/mychats" className="navbar-text">
          My Chats
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Header;
