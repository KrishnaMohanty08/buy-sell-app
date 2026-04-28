const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const createListing = async (listingData) => {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`${API_BASE_URL}/api/listings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(listingData),
        });

        let responseData = null;
        try {
            responseData = await response.json();
        } catch {
            responseData = null;
        }

        if (!response.ok) {
            throw new Error(responseData?.message || "Listing creation failed");
        }

        return responseData;
    } catch (error) {
        throw new Error(error.message || "Unable to create listing");
    }
};