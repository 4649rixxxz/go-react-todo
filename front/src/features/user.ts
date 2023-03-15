import { AxiosResponse, isAxiosError } from "axios"
import { apiClient } from "../lib/apiClient"
import { User } from "../models/user"

export interface AuthResponse extends AxiosResponse {
    data: {
        user_id: number
    }
}

export const fetchAuthenticatedUser = async () => {
    try {
        const result: AuthResponse = await apiClient.get('/v1/auth')
        return result
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            console.log(e.message)
        }
        throw e
    }
}