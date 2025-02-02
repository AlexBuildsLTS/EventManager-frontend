import { createUser, findUserByEmail } from './authRepository';

export const signup = async (userData) => {

  const existingUser = await findUserByEmail(userData.email)

  if (existingUser) {
      throw new Error("User with that email already exists.")
  }

  const user = await createUser(userData);
  return user;
};

export const login = async (userData) => {
    const user = await findUserByEmail(userData.email)

    if (!user) {
        throw new Error("User not found.")
    }

    // TODO: implement password comparison
    return user
}