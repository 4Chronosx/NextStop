// Maintain configuration (base URLs, headers, timeouts) 

if (!import.meta.env.VITE_OPENAI_BASE_URL || !import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("Missing required environment variables for API configuration.");
  }

export const API_HOSTS = {
  HOST_ONE: import.meta.env.VITE_OPENAI_BASE_URL
  //HOST_TWO: process.env.REACT_APP_HOST_TWO_URL || "https://api.hosttwo.com",
};

export const API_KEYS = {
    HOST_ONE: import.meta.env.VITE_OPENAI_API_KEY,
}