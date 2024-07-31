import { createSlice }  from '@reduxjs/toolkit';

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        jwtSession: localStorage.getItem('jwtSession') || '',
        userId: localStorage.getItem('userId') || '',
        canRead: localStorage.getItem('canRead') || false,
        canWrite: localStorage.getItem('canWrite') || false,
        userRole: localStorage.getItem('userRole') || '',
    },
    reducers: {
      storeLoginInfo: (state, {payload}) => {
        localStorage.setItem('jwtSession', payload.accessToken);
        localStorage.setItem('userId', payload.userId);
        localStorage.setItem('canWrite', payload.canWrite);
        localStorage.setItem('canRead', payload.canRead);
        localStorage.setItem('userRole', payload.userRole);
      },
      LogOutUser: () => {
        localStorage.removeItem('jwtSession');
        localStorage.removeItem('userId');
        localStorage.removeItem('canWrite');
        localStorage.removeItem('canRead');
        localStorage.removeItem('userRole');
      },
    },
  })

export const {storeLoginInfo, LogOutUser} = loginSlice.actions;

export default loginSlice.reducer;