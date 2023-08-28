/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../config/axios';

export type LoginType = {
    email: string,
    username: string
}

export const login = async (formData: LoginType) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };
        return await axios
            .post("/auth/login", formData, config)
            .catch((err: any) => {
                console.log("Error occured in fetching:", err.message);
                return err;
            });
    } catch (error: any) {
        console.log("Error occured in fetching:", error.message);
    }
};
