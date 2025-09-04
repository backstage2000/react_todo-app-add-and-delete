import React, { useEffect, useState } from 'react';
import { StatusFilter, Todo } from '../types/Todo';

import * as todoService from '../api/todos';
import { TodoHeader } from './TodoHeader';
import { TodoMain } from './TodoMain';
import { TodoFooter } from './TodoFooter';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessege, setErrorMessege] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrorMessege('');
    setLoading(true);

    todoService
      .getTodos()
      .then(loadingTodos => setTodos(loadingTodos))
      .catch(() => {
        setErrorMessege('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = todos.filter(todo => {
    return (
      statusFilter === 'all' ||
      (statusFilter === 'active' && !todo.completed) ||
      (statusFilter === 'completed' && todo.completed)
    );
  });

  function addTodos({
    title,
    completed,
    userId,
  }: Omit<Todo, 'id'>): Promise<void> {
    return todoService
      .creatTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessege(error);
        throw error;
      })
      .finally(() => setErrorMessege(''));
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader
            todos={todos}
            onSubmit={addTodos}
            setErrorMessege={setErrorMessege}
          />
          {todos && <TodoMain visibleTodos={visibleTodos} loading={loading} />}
          {todos && (
            <TodoFooter setStatusFilter={setStatusFilter} todos={todos} />
          )}
        </div>
        <ErrorNotification messege={errorMessege} />
      </div>
    </>
  );
};
