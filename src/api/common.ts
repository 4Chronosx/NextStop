// Create reusable utility functions or wrappers for common tasks (e.g., GET/POST requests)

export const apiRequest = async (url: string, method:string, body?: any, headers?: any) => {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}