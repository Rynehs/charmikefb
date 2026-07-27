/*
|--------------------------------------------------------------------------
| Storage Keys
|--------------------------------------------------------------------------
*/

const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
};

/*
|--------------------------------------------------------------------------
| Token
|--------------------------------------------------------------------------
*/

export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export function setUser(user) {
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
}

export function getUser() {
  const user = localStorage.getItem(STORAGE_KEYS.USER);

  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

export function clearSession() {
  removeToken();
  removeUser();
}

export function isAuthenticated() {
  return !!getToken();
}