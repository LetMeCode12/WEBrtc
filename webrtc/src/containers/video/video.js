import React, { Component, createRef } from "react";
import "./video.scss";
import Chat from "../../components/chat/chat";
import VideoChat from "../../components/video/videoChat";
import FriendsList from "../../components/friendsList/friendsList";
import socketIOClient from "socket.io-client";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      isAlreadyCalling: false,
      isCalling: false,
      users: [],
    };
    this.peer = undefined;
    this.outerVideo = createRef();
    this.innerViedo = createRef();
    this.socket = socketIOClient("http://localhost:8000").connect();
  }

  renderPeer = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  findSocket = (data) => {
    const { users } = this.state;
    console.log("XD", users, data);
    console.log("Users:", users.filter((e) => e.userId === +data)[0]?.socketId);
    return users.filter((e) => e.userId === +data)[0]?.socketId;
  };

  callUser = async (socketId) => {
    // console.log("pir:", this.peer.connectionState);
    if (!this.peer) {
      this.peer = new RTCPeerConnection();
    }
    try {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));

      await this.socket.emit("call-user", {
        offer,
        to: socketId,
      });
      this.setState({
        isCalling: socketId,
        isAlreadyCalling: true,
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
      console.log("Answe!:", !this.peer);
      if (!this.peer) {
        this.peer = new RTCPeerConnection();
      }
      await this.peer.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      this.setState({
        isCalling: data.socket,
      });
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
  };

  getUsers = () => {
    this.socket.emit("get-users");
  };

  _getUsers = () => {
    this.socket.on("send-users", (data) => {
      console.log("onlineUsers:", data);
      this.setState({
        users: [...data.users],//tu dispatch z redux 
      });
    });
  };

  onRejectMade = () => {
    this.socket.on("reject-made", () => {
      this.onRemoveStream();
    });
  };

  onUserUpdate = () => {
    this.socket.on("user-update", (data) => {
      this.setState({
        users: data,
      });
    });
  };

  async componentDidMount() {
    await this.setState({
      userId: this.renderPeer(),
    });
    this.onUserConnected();
    this.innerVideoRec();
    this.onCallMade();
    this.onAnswerMade();
    this._getUsers();
    this.getUsers();
    this.onRejectMade();
    this.onUserUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isCalling } = this.state;
    if (prevState.isCalling !== isCalling) {
      if (isCalling) {
        this.outerVideoRec();
        this.innerVideoRec();
      }
    }
  }

  onRemoveStream = () => {
    if (this.peer) {
      this.peer.close();
      this.RejectStream();
      this.setState({
        isAlreadyCalling: false,
        isCalling: false,
      });
      this.peer = undefined;
    }
  };

  RejectStream = () => {
    const { isCalling } = this.state;
    this.socket.emit("reject-user", {
      to: isCalling,
    });
  };

  render() {
    return (
      <div className="Video">
        <div className="Center">
          <Chat />
          <VideoChat
            outerVideo={this.outerVideo}
            innerViedo={this.innerViedo}
            isCalling={this.state.isCalling}
          />
          <FriendsList users={this.state.users} userId={this.state.userId} findSocket={this.findSocket} callUser={this.callUser} onRemoveStream={this.onRemoveStream} />
        </div>
      </div>
    );
  }
}

export default Video;
