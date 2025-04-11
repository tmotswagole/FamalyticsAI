type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

export class AuthClient {
  private static async fetchApi<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          error: data.error || "Request failed",
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      };
    }
  }

  // User Operations
  static async setUser(user: any) {
    return this.fetchApi("user", "POST", { user });
  }

  static async getCurrentUser() {
    return this.fetchApi<{
      id: string;
      email: string;
      last_active: number;
    }>("user");
  }

  static async updateActivity() {
    return this.fetchApi("user", "PUT");
  }

  static async logout() {
    return this.fetchApi("user", "DELETE");
  }

  // Role Operations
  static async setUserRole(role: any) {
    return this.fetchApi("role", "POST", role);
  }

  static async getUserRole() {
    return this.fetchApi<{ role: string }>("role");
  }

  // Session Operations
  static async checkSession() {
    return this.fetchApi<{ valid: boolean }>("session");
  }

  // Organization Operations
  static async setOrganization(organization: any) {
    return this.fetchApi("organization", "POST", { organization });
  }

  static async getOrganization() {
    return this.fetchApi<{ organization: string }>("organization");
  }

  // Subscription Operations
  static async setSubscription(subscription: any) {
    return this.fetchApi("subscription", "POST", { subscription });
  }

  static async getSubscription() {
    return this.fetchApi<{ subscription: string }>("subscription");
  }
}
