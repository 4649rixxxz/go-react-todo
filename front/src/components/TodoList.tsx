import type { TodoModel } from "../models/todo";
import Todo from "./Todo";

type TodoListProps = {
    filterStatus: string,
    todos: TodoModel[];
    setTodos: React.Dispatch<React.SetStateAction<TodoModel[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ filterStatus, todos, setTodos }) => {

  return (
    <div className="mx-auto w-[500px]">
      <ul className="border border-gray-300 divide-y divide-gray-300">
        {todos.map((todo) => (
          <Todo filterStatus={filterStatus} todo={todo} setTodos={setTodos} key={todo.todo_id} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;