import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { setUser } from "../../redux/actions/userAction";

class AuthRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: true,
    };
  }

  async componentDidMount() {
    const { setUser } = this.props;
    this.setState(
      {
        token: await localStorage.getItem("token"),
      },
      async () => {
        const res = await fetch(process.env.REACT_APP_URL, {
          headers: {
            Authorization: this.state.token,
          },
        });
        switch (res.status) {
          case 200:
            const data = await res.json();
            const { user } = data;
            setUser(user);
            break;
          default:
            localStorage.clear();
            break;
        }
      }
    );
  }

  render() {
      const { token } = this.state;
      const { user } = this.props;

    return !token && !user ? <Redirect to="/login" /> : <Route {...this.props} />;
  }
}

export default connect((state) => ({
    user:state.UserReducer.user
}), (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
}))(AuthRoute);
