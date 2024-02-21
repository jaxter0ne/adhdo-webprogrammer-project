import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, onValue, push, set, update } from 'firebase/database';

function ListDetail() {
  const { listId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [isTaskDone, setIsTaskDone] = useState(false);

  useEffect(() => {
    const tasksRef = ref(database, `lists/${listId}/tasks`);
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      const loadedTasks = [];
      for (const key in tasksData) {
        loadedTasks.push({ id: key, ...tasksData[key] });
      }
      setTasks(loadedTasks);
    });
  }, [listId]);

  const addTask = () => {
    const taskRef = ref(database, `lists/${listId}/tasks`);
    const newTaskRef = push(taskRef);
    set(newTaskRef, {
      name: newTask,
      deadline: newTaskDeadline || null,
      done: isTaskDone,
    });
    setNewTask('');
    setNewTaskDeadline('');
    setIsTaskDone(false);
  };

  const toggleTaskDone = (taskId, doneStatus) => {
    const taskRef = ref(database, `lists/${listId}/tasks/${taskId}`);
    update(taskRef, { done: doneStatus });
  };

  return (
    <div>
      <Link to={`/`}>Back</Link>
      <h2>Tasks</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <input
        type="date"
        value={newTaskDeadline}
        onChange={(e) => setNewTaskDeadline(e.target.value)}
        placeholder="Deadline (optional)"
      />
      {/* <label>
        Done:
        <input
          type="checkbox"
          checked={isTaskDone}
          onChange={(e) => setIsTaskDone(e.target.checked)}
        />
      </label>
      */}
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTaskDone(task.id, !task.done)}
              />
              {task.name}
              <br />
              {task.deadline && (
                <span>
                  Deadline:{' '}
                  {new Date(task.deadline).toLocaleDateString('en-GB')}
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListDetail;
