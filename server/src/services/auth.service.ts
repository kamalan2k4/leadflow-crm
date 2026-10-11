import bcrypt from "bcryptjs";
import { AppError } from "../errors";
import { UserModel } from "../models/user.model";
import { isDuplicateKeyError } from "../utils/mongo";
import { signAuthToken } from "../utils/token";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

const PASSWORD_SALT_ROUNDS = 12;
const DUPLICATE_EMAIL_MESSAGE = "An account with this email already exists";

export async function registerUser({ name, email, password }: RegisterInput) {
  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new AppError(409, DUPLICATE_EMAIL_MESSAGE);
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  try {
    return await UserModel.create({
      name,
      email,
      passwordHash,
    });
  } catch (error) {
    // The unique database index also protects against simultaneous registrations.
    if (isDuplicateKeyError(error)) {
      throw new AppError(409, DUPLICATE_EMAIL_MESSAGE);
    }

    throw error;
  }
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    token: signAuthToken(user.id),
    user,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(401, "User account no longer exists");
  }

  return user;
}
