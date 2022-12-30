import { memo, useCallback, useState } from 'react';
import { CenteredLayout } from '~/components/layouts';
import { useRenderHighlight } from '~/utils';
import css from './optimize-1.module.scss';

const todosData = [
  { id: 1, text: 'run a marathon', done: false },
  { id: 2, text: 'ride an elephant', done: false },
  { id: 3, text: 'swim with a fish', done: false },
];

interface TodoProps {
  id: number;
  text: string;
  done: boolean;
  onClick: (id: number) => void;
}

const Todo = memo(({ id, text, done, onClick }: TodoProps) => {
  const ref = useRenderHighlight(css.render);
  return (
    <li ref={ref} onClick={() => onClick(id)} className={css.listItem}>
      {done ? '[x]' : '[ ]'} {text}
    </li>
  );
});

export const Optimize1 = () => {
  const [todos, setTodos] = useState(todosData);

  const handleTodoClick = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    );
  }, []);

  return (
    <CenteredLayout className="gap-4">
      <div className="text-3xl">It does not re-renders all items anymore! =)</div>
      <div>We have fixed that</div>
      <ul>
        {todos.map(({ id, text, done }) => (
          <Todo key={id} id={id} text={text} done={done} onClick={handleTodoClick} />
        ))}
      </ul>
    </CenteredLayout>
  );
};
