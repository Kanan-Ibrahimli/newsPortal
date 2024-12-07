// authActions.js
export const loginSuccess = (token, user) => ({
  type: 'LOGIN_SUCCESS',
  payload: { token, user },
});

export const loginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  payload: { error },
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const loginRequest = () => ({ type: 'LOGIN_REQUEST' });
