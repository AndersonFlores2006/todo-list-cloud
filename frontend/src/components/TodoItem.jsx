import React from 'react';

function TodoItem({ todo }) {
  return (
    <div>
      <input type="checkbox" checked={todo.completed} readOnly />
      <span>{todo.title}</span>
    </div>
  );
}

export default TodoItem; 