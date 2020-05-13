import React from "react";
import Logo from "./Logo";

const Home = () => {

  return (
    <div className="home-page">
      <div className="home-page-logo">
        <div className="home-page-icon">
          <Logo className="home-page-icon-logo"/>
          JibbrJabbr
        </div>
      </div>
      <div className="home-page-welcome">
        <div className="home-page-welcome-body">
          <div className="typewriter-welcome-container">
            <h1>Welcome</h1>
          </div>
          <h2 className="home-page-main-text">Tired of someone tuning you out?</h2>
          <h2 className="home-page-main-text"> Or worse, pretending to be interested in what you&apos;re saying?</h2>
          <br></br>
          <div className="home-page-sec-text-container">
            <p className="home-page-sec-text">JibbrJabbr is <b>the</b> free chatroom app for you.</p>
            <p className="home-page-sec-text">You don&apos;t even need to sign up to start using it. 
            <br></br>We believe no one needs to know who you are, 
            <br></br>not even us. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
