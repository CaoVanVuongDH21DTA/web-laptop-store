import { addToCart, deleteCart, removeFromCart, updateQuantity } from "../features/cart"

export const addItemToCartAction = (productItem) => {
  return (dispatch, getState) => {
    dispatch(addToCart(productItem));
    updateLocalStorage(getState);
  };
};

export const updateItemToCartAction = (productItem) =>{
    return (dispatch,state) =>{
        dispatch(updateQuantity({
            productId: productItem?.productId,
            variant_id: productItem?.variant_id,
            quantity: productItem?.quantity
        }))
        updateLocalStorage(state);

    }
}

export const delteItemFromCartAction = (payload)=>{
    return (dispatch,state)=>{
        dispatch(removeFromCart(payload));
        updateLocalStorage(state);
    }
}

const updateLocalStorage = (getState) => {
  const fullState = getState(); // lấy toàn bộ redux state
  const { cartState } = fullState;
  localStorage.setItem('cart', JSON.stringify(cartState.cart));
};

export const clearCart = ()=>{
    return (dispatch,state) =>{
       dispatch(deleteCart());
       localStorage.removeItem('cart');
    }
}