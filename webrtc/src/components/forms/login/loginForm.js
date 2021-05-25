import React, { Component } from "react";
import { Button } from "reactstrap";
import AppInput from "../../input/appInput";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import { submit, validate } from "./loginFormUtils";
import { withRouter } from "react-router-dom";
import { Alert } from "reactstrap";
import camera from "../../../icons/camera.svg";
import { connect } from "react-redux";
import { reSetError, reSetInfo } from "../../../redux/actions/loginAction";
import { reSetUser } from "../../../redux/actions/userAction";

const formName = "loginForm";

class LoginForm extends Component {
  componentDidMount() {
    const { reSetError, reSetInfo, reSetUser } = this.props;
    reSetError();
    reSetInfo();
    reSetUser();
  }

  render() {
    const { handleSubmit, error, info } = this.props;
    return (
      <form className={formName} onSubmit={handleSubmit}>
        <div>
          <img
            className="d-flex mx-auto"
            style={{ height: "20vh", color: "black" }}
            src={camera}
          />
          <h1>Video Chat</h1>
        </div>
        {info && !error && (
          <Alert className="mb-0" color="info">
            {info}
          </Alert>
        )}
        {error && (
          <Alert className="mb-0" color="danger">
            {error}
          </Alert>
        )}
        <Field name="login" placeholder="Login" component={AppInput} />
        <Field
          type="password"
          name="password"
          placeholder="Password"
          component={AppInput}
        />
        <div className="d-flex justify-content-around my-2">
          <Button type="submit" color="primary">
            Zaloguj
          </Button>
          <Button type="button" color="secondary">
            Zarejestruj
          </Button>
        </div>
      </form>
    );
  }
}

export default compose(
  withRouter,
  reduxForm({
    form: formName,
    onSubmit: submit,
    validate,
  }),
  connect(
    (state) => ({
      error: state.LoginReducer.error,
      info: state.LoginReducer.info,
    }),
    (dispatch) => ({
      reSetError: () => dispatch(reSetError),
      reSetInfo: () => dispatch(reSetInfo),
      reSetUser: () => dispatch(reSetUser),
    })
  )
)(LoginForm);
