import { createSlice }  from '@reduxjs/toolkit';

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        jwtSession: localStorage.getItem('jwtSession') || '',
        userId: localStorage.getItem('userId') || '',
        canEdit: localStorage.getItem('canEdit') || false,
        canWrite: localStorage.getItem('canWrite') || false,
        userRole: localStorage.getItem('userRole') || '',
    },
    reducers: {
      storeLoginInfo: (state, {payload}) => {
        localStorage.setItem('jwtSession', payload.accessToken);
        localStorage.setItem('userId', payload.userId);
        localStorage.setItem('canWrite', payload.canWrite);
        localStorage.setItem('canEdit', payload.canEdit);
        localStorage.setItem('userRole', payload.userRole);
      },
      LogOutUser: () => {
        localStorage.removeItem('jwtSession');
        localStorage.removeItem('userId');
        localStorage.removeItem('canWrite');
        localStorage.removeItem('canEdit');
        localStorage.removeItem('userRole');
      },
    },
  })

export const {storeLoginInfo, LogOutUser} = loginSlice.actions;

export default loginSlice.reducer;