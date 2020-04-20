import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Chatroom from "./Chatroom";
import Header from "./Header";

const Routes = () => {
  return (
    <BrowserRouter>
      <div className="header">
        <Header />
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chatroom/:chatroomName" component={Chatroom} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
