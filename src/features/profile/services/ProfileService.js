import { API_BASE_URL } from "../../../config/Config";

const ProfileService = {
  async getUserInfo(username) {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },
  async getUserInfoById(id) {
    const response = await fetch(`${API_BASE_URL}/users/id/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },
};

export default ProfileService;
