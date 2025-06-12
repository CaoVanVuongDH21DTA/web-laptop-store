import { createSlice } from "@reduxjs/toolkit"

// {id:Number,quantity:number}

const initialState = {
    cart:JSON.parse(localStorage.getItem('cart')) || []
}

const cartSlice = createSlice({
    name:'cartState',
    initialState:initialState,
    reducers:{
        addToCart: (state, action) => {
            const existingItemIndex = state.cart.findIndex(item =>
                item.productId === action.payload.productId &&
                (item.variant?.id || null) === (action.payload.variant?.id || null)
            );

            if (existingItemIndex !== -1) {
                const existingItem = state.cart[existingItemIndex];
                existingItem.quantity += 1;
                existingItem.subTotal = existingItem.quantity * existingItem.price;
            } else {
                const newItem = {
                ...action.payload,
                quantity: action.payload.quantity || 1,
                subTotal: (action.payload.quantity || 1) * action.payload.price
                };
                state.cart.push(newItem);
            }
        },

        removeFromCart: (state, action) => {
            return {
                ...state,
                cart: state?.cart?.filter((item) =>
                !(
                    item.productId === action.payload.productId &&
                    (item.variant?.id || null) === (action.payload.variantId || null)
                )
                ),
            };
        },
        updateQuantity: (state, action) => {
            state.cart = state.cart.map((item) => {
                if (
                    item.productId === action.payload.productId &&
                    (item.variant?.id || null) === (action.payload.variant?.id || null)
                ) {
                    return {
                        ...item,
                        quantity: action.payload.quantity,
                        subTotal: action.payload.quantity * item.price
                    };
                }
                return item;
            });
        },

        deleteCart : (state,action)=>{
            return {
                ...state,
                cart:[]
            }
        },
        clearCart: (state) => {
            return {
                ...state,
                cart: []
            };
        }
    }
})

export const { addToCart, removeFromCart, updateQuantity, deleteCart, clearCart} = cartSlice?.actions;

//số lượng sản phẩm trong cart
export const countCartItems = (state) => state?.cartState?.cart?.length;
//đặt cart rỗng
export const selectCartItems = (state) => state?.cartState?.cart ?? []
//tổng tiền của giỏ hàng trong cart
export const selectCartTotal = (state) => state.cartState.cart.reduce((total, item) => total + item.subTotal, 0);
//tổng giá trị quantity trong cart
export const selectTotalQuantity = (state) => state.cartState.cart.reduce((sum, item) => sum + item.quantity, 0);


export default cartSlice.reducer;

