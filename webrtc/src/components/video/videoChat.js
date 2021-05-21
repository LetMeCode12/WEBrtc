import React, { Component, createRef } from "react";
import socketIOClient from "socket.io-client";
import "./videoChat.scss"

class VideoChat extends Component {

  render() {
    const { isCalling, outerVideo, innerViedo } = this.props;
    return (
      <div className="VideoChat">
        <div className="StreamView">
          {!isCalling && <div className="noCall"></div>}
          <video id="OuterVideo" ref={outerVideo} />
          <video id="InnerVideo" ref={innerViedo} />
          <div className="VideoMenu">menu</div>
        </div>
      </div>
    );
  }
}

export default VideoChat;
