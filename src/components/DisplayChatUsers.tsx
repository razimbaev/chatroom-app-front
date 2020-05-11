import React from "react";
import Badge from "react-bootstrap/Badge";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const DisplayChatUsers = ({ handleOpenModal }) => {
  // TODO - store in such a way that will enable users to change username and reflect change in other's UIs
  const handleClick = () => {
    handleOpenModal();
  };

  const users = useSelector((state) => state.users);
  const username = useSelector((state) => state.username);
  // TODO - uncomment below if need to prevent usernames from being changed more than once a day
  // const nextTimeUserNameChangeAllowed = useSelector(
  //   (state) => state.nextTimeUserNameChangeAllowed
  // );

  let numEmptyUsernames = 0;
  const userBadges = users.map((user) => {
    if (user.currentName && user.currentName !== username) {
      return (
        <div key={user.currentName} className="text-align-center">
          <Badge className="chatroom-user-status-box message-other">
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
    // TODO - uncomment below if need to prevent usernames from being changed more than once a day
    return true;
    // if (nextTimeUserNameChangeAllowed == 0) return true;
    // return Date.now() > nextTimeUserNameChangeAllowed;
  };

  const changeUsernameButton = isUsernameChangeAllowed() ? (
    <Button
      variant="outline-light"
      className="create-chatroom"
      onClick={handleClick}
    >
      {username ? "Change Username" : "Set Username"}
    </Button>
  ) : (
    <OverlayTrigger
      overlay={
        <Tooltip id="tooltip-disabled">
          Username can only be changed once every 24 hours
        </Tooltip>
      }
    >
      <span className="d-inline-block">
        <Button
          variant="outline-light"
          className="create-chatroom"
          onClick={handleClick}
          disabled={true}
          style={{ pointerEvents: "none" }}
        >
          {username ? "Change Username" : "Set Username"}
        </Button>
      </span>
    </OverlayTrigger>
  );

  return (
    <div>
      <div className="chatroom-user-window">
        <div>
          <div key={username} className="text-align-center">
            <Badge className="chatroom-user-status-box message-mine">
              {username || "<nameless>"} (you)
            </Badge>
            <br />
          </div>
          {userBadges}
        </div>
        {numEmptyUsernames > 0 && emptyUsernameBadge}
      </div>
      <div className="text-align-center">{changeUsernameButton}</div>
    </div>
  );
};

export default DisplayChatUsers;
