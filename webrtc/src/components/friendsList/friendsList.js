import React, { Component } from "react";
import "./friendsList.scss";
import Icon from "../../icons/ikona.png"

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: true
    }

  }

  onExpandChat = () => {
    let chat = document.getElementsByClassName("Chat")[0];
    console.log("chat", chat)
    chat.classList.toggle("expand")
    this.setState({
      test: !this.state.test
    })
  }

  render() {
    const { users, user, findSocket, callUser } = this.props;
    const { test } = this.state;
    return (
      <div className="Friends">
        <div className="Header"><div className="Icon connect" style={{ "--connection":test?"red":"green"}} ><img src={Icon} /></div><h2>Witaj {user.login}</h2></div>
        <div className="Content">{users &&
          users?.filter(e => e.userId !== user.id)?.map((user, index) => (
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
          <button onClick={this.onExpandChat}>Expand chat</button>
        </div>

      </div>
    );
  }
}

export default FriendsList;
