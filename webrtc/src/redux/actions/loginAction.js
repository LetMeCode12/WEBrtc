export const setError = (error) => (dispatch) => {
    dispatch({type:"ADD_ERROR",payload: error})
}

export const reSetError = (dispatch) => {
  dispatch({ type: "REMOVE_ERROR" });
};

export const setInfo = (info) => (dispatch) => {
  dispatch({ type: "ADD_INFO", payload: info });
};

export const reSetInfo = (dispatch) => {
  dispatch({ type: "REMOVE_INFO" });
};