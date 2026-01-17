const API_BASE_URL = "http://localhost:8080";

export const authService = {
  async signup(data: {
    email: string;
    password: string;
    phone: string;
    fullName: string;
    profileImage: string;
    role: "PATIENT" | "DOCTOR" | "STAFF";
    specialization?: string;
    department?: string;
  }) {
    const response = await fetch(`/spring-server/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(response);
      throw new Error(error.message || "Signup failed");
    }
    return response;
  },

  async login(email: string, password: string) {
    const response = await fetch(`/spring-server/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    const result = await response.json();
    return result;
  },

  async getCurrentUser() {
    const response = await fetch(`/spring-server/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },
};
