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
    <form onSubmit={handleSubmit(submitTodoHandler)} className='mt-3'>
      {errors.label && <div className='text-center text-red-500 mb-1'>{errors.label?.message}</div>}
      <div className='flex justify-center'>
        <input {...register('label', formRequest)} type="text" className="w-9/12 pl-2 mr-2.5" />
        <button className="text-indigo-600" type="submit">
          <i className="fas fa-plus-square fa-2x"></i>
        </button>
      </div>
      <div className="mt-3 text-center">
        <select onChange={filterHandler} name="todos" className="p-2 text-center">
          <option value={STATUS.all}>All</option>
          <option value={STATUS.completed}>Completed</option>
          <option value={STATUS.uncompleted}>Uncompleted</option>
        </select>
      </div>
    </form>
  );
}
  
export default Form;