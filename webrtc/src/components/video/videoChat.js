import React, { Component, createRef } from "react";
import "./videoChat.scss";

class VideoChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMute: false,
      isAudio: true,
    };
  }

  onAudio = () => {
    const { outerVideo } = this.props;
    const { isAudio } = this.state;

    this.setState(
      {
        isAudio: !isAudio,
      },
      () => {
        outerVideo.current.muted = isAudio;
      }
    );
  };

  onMute = () => {
    const { myStream } = this.props;
    myStream.getAudioTracks()[0].enabled =
      !myStream.getAudioTracks()[0].enabled;
    this.setState({ isMute: !this.state.isMute });
  };

  render() {
    const { isMute, isAudio } = this.state;
    const { isCalling, outerVideo, innerViedo, onRemoveStream } = this.props;
    return (
      <div className="VideoChat">
        <div className="StreamView">
          {!isCalling && <div className="noCall"></div>}
          <video id="OuterVideo" ref={outerVideo} />
          <video id="InnerVideo" ref={innerViedo} />
          <div className="VideoMenu">
            <button onClick={this.onMute}>{!isMute ? "Mute" : "UnMute"}</button>
            <button onClick={this.onAudio}>
              Audio {isAudio ? "on" : "Off"}
            </button>
            <button onClick={() => onRemoveStream()}>reject</button>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoChat;
