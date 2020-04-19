import React from "react";
import Badge from "react-bootstrap/Badge";
import { useSelector } from "react-redux";

const DisplayChatUsers = () => {
  // TODO - store in such a way that will enable users to change username and reflect change in other's UIs
  const users = useSelector((state) => state.users);

  const userBadges = users.map((user) => {
    return (
      <div key={user}>
        <Badge variant="success">{user}</Badge>
        <br />
      </div>
    );
  });
  return <div>{userBadges}</div>;
};

export default DisplayChatUsers;
