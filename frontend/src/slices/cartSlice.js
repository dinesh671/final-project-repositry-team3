import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If the item is in the cart, increase its quantity
        existItem.qty += 1;
      } else {
        // If the item is not in the cart, add it with a quantity of 1
        state.cartItems.push({ ...item, qty: 1 });
      }

      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      const itemToRemove = state.cartItems.find(
        (x) => x._id === action.payload
      );

      if (itemToRemove) {
        // If the item is in the cart and its quantity is more than 1, reduce the quantity
        if (itemToRemove.qty > 1) {
          itemToRemove.qty -= 1;
        } else {
          // If the quantity is 1 or less, remove the item from the cart
          state.cartItems = state.cartItems.filter(
            (x) => x._id !== action.payload
          );
        }
      }
    },
    deleteFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
