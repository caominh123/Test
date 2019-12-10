import { find, isNull, isEmpty, filter } from "lodash";
import cookie from "../util/cookie";
export default (
  state = {
    cart: isEmpty(cookie.get(null, "cart"))
      ? []
      : JSON.parse(cookie.get(null, "cart")),
    numberInCart: isEmpty(cookie.get(null, "numberInCart"))
      ? 0
      : JSON.parse(cookie.get(null, "numberInCart"))
  },
  action
) => {
  switch (action.type) {
    case "ADD_PRODUCT_TO_CART":
      console.log(state.cart);
      cookie.set(null, "numberInCart", state.numberInCart + 1);
      if (!isNull(state.cart)) {
        const item = find(state.cart, (i) => i._id === action.payload._id);
        if (item) {
          item.quality++;
          cookie.set(null, "cart", JSON.stringify([...state.cart]));
          return {
            cart: [...state.cart],
            numberInCart: state.numberInCart + 1
          };
        } else {
          action.payload.quality = 1;
          cookie.set(
            null,
            "cart",
            JSON.stringify([...state.cart, action.payload])
          );
          return {
            cart: [...state.cart, action.payload],
            numberInCart: state.numberInCart + 1
          };
        }
      } else {
        action.payload.quality = 1;
        cookie.set(null, "cart", JSON.stringify([action.payload]));
        return {
          cart: [action.payload],
          numberInCart: state.numberInCart + 1
        };
      }
    case "DELETE_PRODUCT_IN_CART":
      const items = filter(state.cart, (i) => i._id !== action.payload.id);
      cookie.set(null, "cart", JSON.stringify([...items]));
      cookie.set(
        null,
        "numberInCart",
        JSON.stringify(
          state.numberInCart - action.payload.quality >= 0
            ? state.numberInCart - action.payload.quality
            : 0
        )
      );
      return {
        cart: [...items],
        numberInCart:
          state.numberInCart - action.payload.quality >= 0
            ? state.numberInCart - action.payload.quality
            : 0
      };
    case "INCREASE_QUALITY":
      const itemIncrease = find(state.cart, (i) => i._id === action.payload.id);
      itemIncrease.quality++;
      cookie.set(null, "cart", JSON.stringify([...state.cart]));
      return {
        cart: [...state.cart],
        numberInCart: state.numberInCart + 1
      };

    case "DECREASE_QUALITY":
      const itemDecrease = find(state.cart, (i) => i._id === action.payload.id);
      itemDecrease.quality - 1 > 1
        ? itemDecrease.quality--
        : (itemDecrease.quality = 1);
      cookie.set(null, "cart", JSON.stringify([...state.cart]));

      return {
        cart: [...state.cart],
        numberInCart:
          state.numberInCart - 1 > state.cart.length
            ? state.numberInCart - 1
            : state.cart.length
      };
    case "DESTROY_CART":
      cookie.set(null, "cart", null);
      cookie.set(null, "numberInCart", 0);
      return {
        cart: [],
        numberInCart: 0
      };

    default:
      return state;
  }
};
