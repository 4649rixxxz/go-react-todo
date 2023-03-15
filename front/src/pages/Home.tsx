import { useState, useEffect } from 'react';
import '../App.css';
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
    <div>
      <header>
        <h1>Ed's Todo List</h1>
        <button onClick={logoutHandler}>ログアウト</button>
      </header>
      <Form
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setTodos={setTodos}
      />
      <TodoList
        filterStatus={filterStatus}
        todos={todos} 
        setTodos={setTodos} 
      />
    </div>
  );
}

export default Home;