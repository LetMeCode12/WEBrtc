import React, { Component, createRef } from "react";
import "./video.scss";
import Chat from "../../components/chat/chat";
import VideoChat from "../../components/video/videoChat";
import FriendsList from "../../components/friendsList/friendsList";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyCalling: false,
      isCalling: false,
      users: [],
      isMute: false,
    };
    this.peer = undefined;
    this.myStream = undefined;
    this.outerVideo = createRef();
    this.innerViedo = createRef();
    this.socket = socketIOClient(process.env.REACT_APP_URL).connect();
  }

  findSocket = (data) => {
    const { users } = this.state;
    return users.filter((e) => e.userId === data)[0]?.socketId;
  };

  callUser = async (socketId) => {
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
        this.myStream = stream;
        const localVideo = this.innerViedo.current;
        if (localVideo) {
          localVideo.srcObject = this.myStream;
          localVideo.onloadedmetadata = () => {
            localVideo.muted = true;
            localVideo.play();
          };
        }
        if (this.peer) {
          this.myStream.getTracks().forEach((track) => {
            this.peer.addTrack(track, this.myStream);
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
    const { id, login } = this.props.user;
    this.socket.emit("user-connected", { userId: id, login: login });
  };

  getUsers = () => {
    this.socket.emit("get-users");
  };

  _getUsers = () => {
    this.socket.on("send-users", (data) => {
      const { users } = data;
      console.log("onlineUsers:", users);

      this.setState({
        users: [...users],
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
    // this.innerVideoRec();
    this.onCallMade();
    this.onAnswerMade();
    this._getUsers();
    this.getUsers();
    this.onRejectMade();
    this.onUserUpdate();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { isCalling } = this.state;
    if (prevState.isCalling !== isCalling) {
      if (isCalling) {
        this.outerVideoRec();
        this.innerVideoRec();
      }
    }
    if (prevProps.user !== this.props.user) {
      await this.onUserConnected();
      await this.getUsers();
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
      const vid = this.innerViedo.current
      vid.pause();
      vid.src = "";
    }
  };

  RejectStream = () => {
    const { isCalling } = this.state;
    this.socket.emit("reject-user", {
      to: isCalling,
    });
    this.myStream.getTracks().forEach(function (track) {
      if (track.readyState == "live") {
        track.stop();
      }
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
            myStream={this.myStream}
            onRemoveStream={this.onRemoveStream}
          />
          <FriendsList
            users={this.state.users}
            user={this.props.user}
            findSocket={this.findSocket}
            callUser={this.callUser}
          />
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  user: state.UserReducer.user,
}))(Video);
