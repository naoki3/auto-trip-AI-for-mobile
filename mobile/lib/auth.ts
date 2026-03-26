import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'session_token';
const USERNAME_KEY = 'username';
const USER_ID_KEY = 'user_id';

export interface AuthState {
  token: string;
  userId: string;
  username: string;
}

export async function saveAuth(auth: AuthState): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, auth.token);
  await SecureStore.setItemAsync(USERNAME_KEY, auth.username);
  await SecureStore.setItemAsync(USER_ID_KEY, auth.userId);
}

export async function loadAuth(): Promise<AuthState | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const username = await SecureStore.getItemAsync(USERNAME_KEY);
  const userId = await SecureStore.getItemAsync(USER_ID_KEY);
  if (!token || !username || !userId) return null;
  return { token, username, userId };
}

export async function clearAuth(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USERNAME_KEY);
  await SecureStore.deleteItemAsync(USER_ID_KEY);
}
