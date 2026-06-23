import bcrypt from "bcryptjs";
import { User, UserRole } from "../models/User";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens";
import type { AuthPayload, JwtUser, LoginPayload } from "../types/auth";

export const registerUser = async (payload: AuthPayload) => {
  const existing = await User.findOne({ email: payload.email });

  if (existing) {
    return { status: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    name: payload.name || "News User",
    email: payload.email,
    password: hashedPassword,
    role: payload.role || "author",
    approvalStatus: payload.role === "reporter" ? "pending" : "active",
  });

  return {
    status: payload.role === "reporter" ? 202 : 201,
    message: payload.role === "reporter" ? "Reporter application submitted" : "User registered",
    userId: user.id,
  };
};

export const loginUser = async (payload: LoginPayload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    return { status: 401, message: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    return { status: 401, message: "Invalid credentials" };
  }

  if (user.role !== payload.role) {
    return {
      status: 403,
      message: payload.role === "reporter" ? "This login is for reporter accounts." : "Please use a Super Admin account.",
    };
  }

  if (user.role === "reporter") {
    const approvalStatus = user.approvalStatus || "active";

    if (approvalStatus !== "active") {
      return {
        status: 403,
        message:
          approvalStatus === "rejected"
            ? "Reporter application was rejected by the admin."
            : "Reporter account is waiting for admin approval.",
      };
    }
  }

  const tokenPayload: JwtUser = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    status: 200,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus || "active",
    },
  };
};

export const refreshUserSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId);

  if (!user || user.refreshToken !== refreshToken) {
    return { status: 401, message: "Invalid refresh token" };
  }

  const nextPayload: JwtUser = { userId: user.id, role: user.role };
  const newAccessToken = signAccessToken(nextPayload);
  const newRefreshToken = signRefreshToken(nextPayload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    status: 200,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const getCurrentUser = async (userId: string) => {
  return User.findById(userId).select("name email role approvalStatus");
};

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
