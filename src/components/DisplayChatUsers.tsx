import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import ChangeUsernameModal from "./ChangeUsernameModal";

const DisplayChatUsers = () => {
  // TODO - store in such a way that will enable users to change username and reflect change in other's UIs
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const users = useSelector((state) => state.users);
  const username = useSelector((state) => state.username);
  const nextTimeUserNameChangeAllowed = useSelector(
    (state) => state.nextTimeUserNameChangeAllowed
  );

  let numEmptyUsernames = 0;
  const userBadges = users.map((user) => {
    if (user.currentName && user.currentName !== username) {
      return (
        <div key={user.currentName} className="text-align-center">
          <Badge variant="success" className="chatroom-user-status-box">
            {user.currentName}
          </Badge>
          <br />
        </div>
      );
    }
    numEmptyUsernames++;
  });

  numEmptyUsernames--;
  const emptyUsernameBadge = (
    <div
      key={numEmptyUsernames + " nameless users"}
      className="text-align-center"
    >
      <Badge variant="secondary" className="chatroom-user-status-box">
        + {numEmptyUsernames} other nameless user(s)
      </Badge>
      <br />
    </div>
  );

  const isUsernameChangeAllowed = () => {
    if (nextTimeUserNameChangeAllowed == 0) return true;
    return Date.now() > nextTimeUserNameChangeAllowed;
  };

  return (
    <div>
      <div className="chatroom-user-window">
        <div>
          <div key={username} className="text-align-center">
            <Badge variant="primary" className="chatroom-user-status-box">
              {username || "<nameless>"} (you)
            </Badge>
            <br />
          </div>
          {userBadges}
        </div>
        {numEmptyUsernames > 0 && emptyUsernameBadge}
      </div>
      <div className="text-align-center">
        <Button
          variant="outline-primary"
          onClick={handleClick}
          disabled={!isUsernameChangeAllowed()}
        >
          {username ? "Change Username" : "Set Username"}
        </Button>
      </div>
      <ChangeUsernameModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default DisplayChatUsers;
