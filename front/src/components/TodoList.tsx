import type { TodoModel } from "../models/todo";
import Todo from "./Todo";

type TodoListProps = {
    filterStatus: string,
    todos: TodoModel[];
    setTodos: React.Dispatch<React.SetStateAction<TodoModel[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ filterStatus, todos, setTodos }) => {

  return (
    <div className="todo-container">
      <ul className="todo-list">
        {todos.map((todo) => (
          <Todo filterStatus={filterStatus} todo={todo} setTodos={setTodos} key={todo.todo_id} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;