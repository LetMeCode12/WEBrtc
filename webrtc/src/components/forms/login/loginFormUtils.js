import {
  reSetError,
  reSetInfo,
  setError,
  setInfo,
} from "../../../redux/actions/loginAction";

export const submit = (values, dispatch, props) => {
  const { history } = props;
  const data = {
    login: values.login,
    password: values.password,
  };
  dispatch(setInfo("Trwa logowanie..."));
  fetch(process.env.REACT_APP_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      switch (res.status) {
        case 200:
          break;
        default:
          dispatch(setError("Logowanie nie powiodło się"));
          dispatch(reSetInfo);

          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("token", "Bearer " + data.auth);
      localStorage.setItem("refreshToken", "Bearer " + data.refreshToken);
      dispatch(reSetError);
      history.push("/");
    })
    .catch((err) => {
      console.error(err);
      //   dispatch(setError("Logowanie nie powiodło się"));
    });
};

export const validate = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Pole wymagane";
  }

  if (!values.login) {
    errors.login = "Pole wymagane";
  }

  return errors;
};
