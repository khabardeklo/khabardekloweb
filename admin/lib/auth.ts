type LoginRole = "admin" | "reporter";

type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    approvalStatus?: string;
  };
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export const logout = async (): Promise<void> => {
  const response = await fetch(`${backendUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  // Token may already be expired or missing; consider this a successful logout.
  if (response.status === 401 || response.status === 403) {
    return;
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message || "Logout failed");
  }
};

export const loginWithRole = async (role: LoginRole, email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  if (role === "admin" && data.user.role !== "admin") {
    throw new Error("Please use a Super Admin account.");
  }

  if (role === "reporter" && data.user.role !== "reporter") {
    throw new Error("This login is for reporter accounts.");
  }

  return data;
};
