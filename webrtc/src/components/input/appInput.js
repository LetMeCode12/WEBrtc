import React, { Component } from "react";
import "./appInput.scss";
import { Input, Label } from "reactstrap";

class AppInput extends Component {
  render() {
    const {
      input,
      label,
      valid,
      meta: { touched, error },
      ...rest
    } = this.props;
    return (
      <div className="AppInput">
        {label && <Label> {label}</Label>}
        <Input
          {...rest}
          {...input}
          invalid={touched && error}
          valid={valid ? touched && !error : false}
        />
        {touched && error && <span className="error">{error}</span>}
      </div>
    );
  }
}

export default AppInput;
