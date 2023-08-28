import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("UserInfo");
const parsedUserInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null;

const initialState = {
  userInfo: parsedUserInfo,
  reason: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPerson: (state, action) => {
      state.userInfo = action.payload
    },
    userLoginFailed: (state, action) => {
      state.reason = action.payload
    },
    setLogout: (state) => {
      state.userInfo = null;
    }
  }
});

export default userSlice.reducer;
export const { addPerson, userLoginFailed, setLogout } = userSlice.actions;