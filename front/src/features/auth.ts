import { AxiosResponse, isAxiosError } from "axios"
import { apiClient } from "../lib/apiClient"

export interface LoginResponse extends AxiosResponse {
  data: {
    user_id: number
  }
}

type LoginRequest = {
  email: string,
  password: string
}

export const login = async (data: LoginRequest) => {
  try {
    const result: LoginResponse = await apiClient.post('/v1/login', data)
    return result
  } catch (e: unknown) {
    if (isAxiosError(e)) {
        console.log(e.message)
    }
    throw e
  }
}

export const logout = async () => {
  try {
    await apiClient.post('/v1/logout')
  } catch (e: unknown) {
    if (isAxiosError(e)) {
        console.log(e.message)
    }
    throw e
  }
}