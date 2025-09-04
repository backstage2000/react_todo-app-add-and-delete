import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessege: (message: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onSubmit,
  setErrorMessege,
}) => {
  const [title, setTitle] = useState('');
  const [hasTitleError, setHasTitleError] = useState('');

  const [completed, setCompleted] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError('');
  };

  const reset = () => {
    setTitle('');
    setHasTitleError('');
    setErrorMessege('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasTitleError('');

    if (!title.trim()) {
      setHasTitleError('Title should not be empty');
      setErrorMessege('Title should not be empty');

      return;
    }

    onSubmit({
      title,
      completed,
      userId: USER_ID,
    }).then(reset);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        // className="todoapp__toggle-all active"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit} onReset={reset}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />
      </form>
    </header>
  );
};
