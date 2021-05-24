const initialState = {
  name: "Login",
  error: "",
  info:""
};

export default function(store = initialState, action) {
  switch (action.type) {
    case "ADD_ERROR":
      return { ...store, error: action.payload };
    case "REMOVE_ERROR":
      return { ...store, error: "" };
    case "ADD_INFO":
      return { ...store, info: action.payload };
    case "REMOVE_INFO":
      return { ...store, info: "" };
    default:
      return store;
  }
}
