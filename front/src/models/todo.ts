export type TodoModel = {
  todo_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  user_id: number;
  label: string;
  completed_at?: Date;
}