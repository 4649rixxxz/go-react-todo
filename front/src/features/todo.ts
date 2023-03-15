import { AxiosResponse, isAxiosError } from "axios"
import { STATUS } from "../consts/filter"
import { apiClient } from "../lib/apiClient"
import { TodoModel } from "../models/todo"


export interface TodosResponse extends AxiosResponse {
    data: {
        todos: TodoModel[]
    }
}

export const fetchTodos = async (status?: string) => {
    try {
        const todos: TodosResponse = await apiClient.get('/v1/todos', {
            params: {
                status: status ?? STATUS.all
            }
        })
        return todos
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            console.log(e.message)
        }
        throw e
    }
}

export interface TodoResponse extends AxiosResponse {
    data: {
        todo: TodoModel
    }
}

export const createTodo = async (data: {label: string}) => {
    try {
        const todo: TodoResponse = await apiClient.post('/v1/todos', data)
        return todo
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            console.log(e.message)
        }
        throw e
    }
}

export const completeTodo = async (todo_id: number) => {
    try {
        const todo: TodoResponse = await apiClient.patch(`/v1/todos/${todo_id}/complete`)
        return todo
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            console.log(e.message)
        }
        throw e
    }
}

export const deleteTodo = async (todo_id: number) => {
    try {
        await apiClient.delete(`/v1/todos/${todo_id}`)
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            console.log(e.message)
        }
        throw e
    }
}