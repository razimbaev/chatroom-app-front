import React from "react";
import Logo from "./Logo";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-page-logo">
        <div className="home-page-icon">
          <Logo className="home-page-icon-logo" />
          JibbrJabbr
        </div>
      </div>
      <div className="home-page-welcome">
        <div className="home-page-welcome-body">
          <div className="typewriter-welcome-container">
            <h1>Welcome</h1>
          </div>
          <h2 className="home-page-main-text">
            Tired of someone tuning you out?
          </h2>
          <h2 className="home-page-main-text">
            {" "}
            Or worse, pretending to be interested in what you&apos;re saying?
          </h2>
          <br />
          <div className="home-page-sec-text-container">
            <p className="home-page-sec-text">
              JibbrJabbr is <b>the</b> free chatroom app for you.
            </p>
            <p className="home-page-sec-text">
              You don&apos;t even need to sign up to start using it.
              <br />
              We believe no one needs to know who you are,
              <br />
              not even us.
            </p>
          </div>
          <br />
          <br />
          <div className="home-page-sec-text-container home-page-button-container">
            <Button
              variant="outline-light"
              className="create-chatroom"
              style={{ display: "inline-block" }}
              as={Link}
              to="/explore"
            >
              Explore Chatrooms
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
