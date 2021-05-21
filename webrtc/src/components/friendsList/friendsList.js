import React, { Component } from "react";
import "./friendsList.scss";

class FriendsList extends Component {
  render() {
    const { users, userId, findSocket, callUser, onRemoveStream } = this.props;
    return (
      <div className="Friends">
        {users && users?.map((user) => <div>{user?.userId}</div>)}
            <p>User id:{userId }</p>
        <input ref={(reff) => (this.myInput = reff)} />
        <button
          onClick={() => {
            callUser(findSocket(this.myInput.value));
          }}
        >
          Click
        </button>
        <button onClick={() => onRemoveStream()}>reject</button>
      </div>
    );
  }
}

export default FriendsList;
