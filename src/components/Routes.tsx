import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Chatroom from "./Chatroom";
import Header from "./Header";
import MyChats from "./MyChats";

const Routes = () => {
  return (
    <BrowserRouter>
      <div className="header">
        <Header />
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chatroom/:chatroomName" component={Chatroom} />
        <Route exact path="/mychats" component={MyChats} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
