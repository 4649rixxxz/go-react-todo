import { useState, useEffect } from 'react';
import type { TodoModel } from "../models/todo";
import Form from "../components/Form";
import TodoList from "../components/TodoList";
import { fetchTodos } from '../features/todo';
import { STATUS } from '../consts/filter';
import { logout } from '../features/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [filterStatus, setFilterStatus] = useState<string>(STATUS.all);
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        const res = await fetchTodos(filterStatus);
        const {data} = res
        setTodos(data.todos)
      } catch(e) {
        console.log(e);
      }
    }
    fetchFunction();
  }, [filterStatus]);

  const logoutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (e: unknown) {
      console.log(e);
    }
  }
  
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className='relative'>
          <button onClick={logoutHandler} className="absolute right-0 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            ログアウト
          </button>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900">
          ToDo List
        </h2>
        <Form
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setTodos={setTodos}
        />
      </div>
      <TodoList
        filterStatus={filterStatus}
        todos={todos} 
        setTodos={setTodos} 
      />
    </div>
  );
}

export default Home;