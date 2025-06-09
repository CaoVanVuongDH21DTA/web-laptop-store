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
                // Sản phẩm đã tồn tại, cập nhật số lượng và subtotal
                const existingItem = state.cart[existingItemIndex];
                existingItem.quantity += 1;
                existingItem.subTotal = existingItem.quantity * existingItem.price;
            } else {
                // Sản phẩm chưa có, thêm mới
                const newItem = {
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                    subTotal: (action.payload.quantity || 1) * action.payload.price
                };
                state.cart.push(newItem);
            }
            return state;
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
        updateQuantity:(state,action) =>{
            return {
                ...state,
                cart: state?.cart?.map((item)=>{
                    if(item?.variant?.id === action?.payload?.variant_id){
                        return {
                            ...item,
                            quantity:action?.payload?.quantity,
                            subTotal: action?.payload?.quantity * item.price
                        }
                    }
                    return item;
                })
            };
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

export const countCartItems = (state) => state?.cartState?.cart?.length;
export const selectCartItems = (state) => state?.cartState?.cart ?? []
export const selectCartTotal = (state) => state?.cartState?.cart?.subTotal;
export default cartSlice.reducer;

