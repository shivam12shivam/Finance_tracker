import { configureStore } from '@reduxjs/toolkit';
import authReduer from './userSlice';
import expenseReducer from './expenseSlice';

const store = configureStore({
  reducer: {
    auth: authReduer,
    expenses: expenseReducer,
  },
});

export default store;
