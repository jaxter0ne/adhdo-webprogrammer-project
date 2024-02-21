import React from 'react';

const TodoItem = ({ todo, onDelete }) => (
  <li>
    {todo.title}
    <button onClick={() => onDelete(todo.id)}>Delete</button>
  </li>
);

export default TodoItem;