import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Explore from "./Explore";
import Chatroom from "./Chatroom";
import Header from "./Header";
import MyChats from "./MyChats";

const Routes = () => {
  const [redirect, setRedirect] = useState("");

  const handleRedirect = (newRedirect) => {
    setRedirect(newRedirect);
  };

  const redirectElement = redirect ? (
    <Redirect to={"/chatroom/" + redirect} />
  ) : null;

  return (
    <BrowserRouter>
      <div className="header">
        <Header setRedirect={handleRedirect} />
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/explore" component={Explore} />
        <Route exact path="/chatroom/:chatroomName" component={Chatroom} />
        <Route exact path="/mychats" component={MyChats} />
      </Switch>
      {redirectElement}
    </BrowserRouter>
  );
};

export default Routes;
