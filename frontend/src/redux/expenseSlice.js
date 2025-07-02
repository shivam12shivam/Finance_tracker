// src/redux/expenseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
