import type { TodoModel } from "../models/todo";
import { completeTodo, deleteTodo, fetchTodos } from '../features/todo';

type TodoProps = {
    filterStatus: string
    todo: TodoModel;
    setTodos: React.Dispatch<React.SetStateAction<TodoModel[]>>;
}

const Todo: React.FC<TodoProps> = ({ filterStatus, todo, setTodos }) => {
    const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        await deleteTodo(todo.todo_id)
        const {data} = await fetchTodos(filterStatus)
        setTodos(data.todos)
      } catch (e: unknown) {
        console.log(e);
      }
    };
    const completeHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        await completeTodo(todo.todo_id)
        const {data} = await fetchTodos(filterStatus)
        setTodos(data.todos)
      } catch (e: unknown) {
        console.log(e);
      }
    };
  
    return (
      <div className="todo">
        <li className={`todo-item ${todo.completed_at ? "completed" : ""}`}>{todo.label}</li>
        <button onClick={completeHandler} className="complete-btn">
          <i className="fas fa-check"></i>
        </button>
        <button onClick={deleteHandler} className="trash-btn">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    );
  }
  
  export default Todo;