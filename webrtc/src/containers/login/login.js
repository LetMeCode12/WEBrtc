import React, { Component } from "react";
import "./login.scss";
import LoginForm from "../../components/forms/login/loginForm";

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <div className="Center">
          <LoginForm />
        </div>
      </div>
    );
  }
}

export default Login;
