import { useState } from 'react';
import { createTodo, fetchTodos } from '../features/todo';
import type { TodoModel } from "../models/todo";
import { STATUS } from '../consts/filter';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormProps = {
  filterStatus: string,
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<TodoModel[]>>;
}

type FormInput = {
  label: string;
}

const Form: React.FC<FormProps> = ({ filterStatus, setFilterStatus, setTodos }) => {
  const { register, formState: { errors }, handleSubmit, reset} = useForm<FormInput>();
  const submitTodoHandler: SubmitHandler<FormInput> = async (formValue: FormInput) => {
    // Todoの新規登録
    try {
      await createTodo({label: formValue.label})
      const {data} = await fetchTodos(filterStatus)
      setTodos(data.todos)
    } catch (e: unknown) {
      console.log(e);
    }
    // フォームの値をクリア
    reset();
  }
  
  const filterHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value)
  };
  const formRequest = {
    required: '未入力です。', 
    maxLength: {value:20, message: '20文字まで入力可能です。'}
  };

  return (
    <form onSubmit={handleSubmit(submitTodoHandler)}>
      {errors.label && <div>{errors.label?.message}</div>}
      <input {...register('label', formRequest)} type="text" className="todo-input" />
      <button className="todo-button" type="submit">
        <i className="fas fa-plus-square"></i>
      </button>
      <div className="select">
        <select onChange={filterHandler} name="todos" className="filter-todo">
          <option value={STATUS.all}>All</option>
          <option value={STATUS.completed}>Completed</option>
          <option value={STATUS.uncompleted}>Uncompleted</option>
        </select>
      </div>
    </form>
  );
}
  
  export default Form;