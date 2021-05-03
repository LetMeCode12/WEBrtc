import React, { Component, createRef } from "react";
import "./App.scss";
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      isAlreadyCalling: false,
      users: [],
    };
    this.intervalGetUsers = undefined;
    this.peer = new RTCPeerConnection();
    this.outerVideo = createRef();
    this.innerViedo = createRef();
    this.socket = socketIOClient("http://localhost:8000").connect();
  }

  renderPeer = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  findSocket = (data) => {
    const { users } = this.state;
    console.log("XD",users,data)
    console.log("Users:", users.filter((e) => e.userId === +data)[0]?.socketId);
    return users.filter((e) => e.userId === +data)[0]?.socketId;
  };

  callUser = async (socketId) => {
    // console.log("pir:", this.peer.connectionState);
    try {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));

      await this.socket.emit("call-user", {
        offer,
        to: socketId,
      });
    } catch (e) {
      console.error(e);
    }
  };

  innerVideoRec = () => {
    navigator.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        const localVideo = this.innerViedo.current;
        if (localVideo) {
          localVideo.srcObject = stream;
          localVideo.onloadedmetadata = () => {
            localVideo.muted = true;
            localVideo.play();
          };
        }
        if (this.peer) {
          stream.getTracks().forEach((track) => {
            this.sender = this.peer.addTrack(track, stream);
          });
        }
      },
      (error) => {
        console.warn(error.message);
      }
    );
  };

  outerVideoRec = () => {
    if (this.peer) {
      console.log("peer:", this.peer);
      this.peer.ontrack = ({ streams: [stream] }) => {
        const remoteVideo = this.outerVideo.current;
        if (remoteVideo) {
          remoteVideo.srcObject = stream;
          remoteVideo.play();
        }
      };
    }
  };

  onAnswerMade = () => {
    const { isAlreadyCalling } = this.state;
    this.socket.on("answer-made", async (data) => {
      try {
        await this.peer.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } catch (e) {
        console.error(e);
      }

      if (!isAlreadyCalling) {
        this.callUser(data.socket);
        this.setState({
          isAlreadyCalling: true,
        });
      }
    });
  };

  onCallMade = () => {
    this.socket.on("call-made", async (data) => {
      // alert("Tu bedzie odbieranie");
      await this.peer.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      console.log("Answe!");
      this.socket.emit("make-answer", {
        answer,
        to: data.socket,
      });
    });
  };

  onUserConnected = () => {
    const { userId } = this.state;
    this.socket.id = userId;
    this.socket.emit("user-connected", { userId: userId });
    console.log("soket", this.socket);
  };

  getUsers = () => {
    console.log("inter!");
    this.socket.emit("get-users");
  };

  _getUsers = () => {
    this.socket.on("send-users", (data) => {
      console.log("onlineUsers:", data);
      this.setState({
        users: [...data.users],
      });
    });
  };

  async componentDidMount() {
    await this.setState({
      userId: this.renderPeer(),
    });
    this.onUserConnected();
    this.innerVideoRec();
    this.outerVideoRec();
    this.onCallMade();
    this.onAnswerMade();
    this._getUsers();
    this.getUsers();
    this.intervalGetUsers = setInterval(this.getUsers, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalGetUsers);
  }

  // onRemoveStream = () => {
  //   this.peer.removeTrack(this.sender);
  //   this.peer.close();
  //   this.setState({
  //     isAlreadyCalling: false,
  //   });
  // };

  render() {
    const { userId, users } = this.state;
    return (
      <div className="App">
        <div className="Center">
          <div className="Chat">
            <p>User id:{userId}</p>
            <input ref={(reff) => (this.myInput = reff)} />
            <button
              onClick={() => {
                this.callUser(this.findSocket(this.myInput.value));
              }}
            >
              Click
            </button>
            {/* <button onClick={() => this.onRemoveStream()}>reject</button> */}
          </div>
          <div className="VideoChat">
            <div className="StreamView">
              <video id="InnerVideo" ref={this.innerViedo} />
              <video id="OuterVideo" ref={this.outerVideo} />
            </div>
          </div>
          <div className="Friends">
            {users && users?.map((user) => <div>{user?.userId}</div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
