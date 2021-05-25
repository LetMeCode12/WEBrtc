export const setUser = (user) => (dispatch) => {
    dispatch({type:"ADD_USER", payload: user})
}

export const reSetUser = (dispatch) => {
  dispatch({ type: "REMOVE_USER" });
};