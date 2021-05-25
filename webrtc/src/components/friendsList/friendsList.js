import React, { Component } from "react";
import "./friendsList.scss";

class FriendsList extends Component {
  render() {
    const { users, user, findSocket, callUser, onRemoveStream } = this.props;
    return (
      <div className="Friends">
        {users &&
          users?.filter(e=>e.userId!==user.id)?.map((user, index) => (
            <div>
              {index}: {user?.login}
              <button
                onClick={() => {
                  callUser(findSocket(user?.userId));
                }}
              >
                Call
              </button>
            </div>
          ))}
        <p>Login: {user.login}</p>
      </div>
    );
  }
}

export default FriendsList;
