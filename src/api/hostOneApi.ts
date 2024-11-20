import { apiRequest } from "./common";
import { API_HOSTS, API_KEYS } from "./config";


export const getUserData = async () => {
    return apiRequest(`${API_HOSTS.HOST_ONE}`, "GET");
}

export const postUserData = async (data: any) => {
    return apiRequest(
        `${API_HOSTS.HOST_ONE}`, 
        "POST", 
        data, 
        {Authorization: "Bearer " + API_KEYS.HOST_ONE}
    );
}