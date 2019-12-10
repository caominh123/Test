export const addProductToCart = (product) => {
  return async (dispatch) => {
    dispatch({
      type: "ADD_PRODUCT_TO_CART",
      payload: product
    });
  };
};

export const deleteProductInCart = (id, quality) => {
  return async (dispatch) => {
    dispatch({
      type: "DELETE_PRODUCT_IN_CART",
      payload: { id, quality }
    });
  };
};

export const increaseQuality = (id) => {
  return async (dispatch) => {
    console.log("id", id);
    dispatch({
      type: "INCREASE_QUALITY",
      payload: { id }
    });
  };
};

export const decreaseQuality = (id) => {
  return async (dispatch) => {
    console.log("id", id);
    dispatch({
      type: "DECREASE_QUALITY",
      payload: { id }
    });
  };
};
export const destroyCart = () => {
  return async (dispatch) => {
    dispatch({
      type: "DESTROY_CART"
    });
  };
};
