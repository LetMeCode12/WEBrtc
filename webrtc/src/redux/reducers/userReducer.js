const initialState = {
  name: "User",
  user: "",
};

export default function(store = initialState, action) {
  switch (action.type) {
    case "ADD_USER":
      return { ...store, user: action.payload };
    case "REMOVE_USER":
      return { ...store, user: "" };
    default:
      return store;
  }
}
