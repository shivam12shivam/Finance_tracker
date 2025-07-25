import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuth: false,
  token: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.isAuth = true;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.token = null;
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;
