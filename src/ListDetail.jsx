import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import EditListName from './EditListName'; // Import the new component

function ListDetail() {
  const { listId } = useParams();
  const [listName, setListName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [isTaskDone, setIsTaskDone] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editedTaskDeadline, setEditedTaskDeadline] = useState('');
  const [originalListName, setOriginalListName] = useState('');

  useEffect(() => {
    const listRef = ref(database, `lists/${listId}`);
    onValue(listRef, (snapshot) => {
      const data = snapshot.val() || {};
      setListName(data.name);
    }, [listId]);

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

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
    setEditedTaskDeadline(task.deadline || '');
  };

  const saveTask = (taskId) => {
    const taskRef = ref(database, `lists/${listId}/tasks/${taskId}`);
    update(taskRef, {
      name: editedTaskName,
      deadline: editedTaskDeadline || null,
    });
    setEditingTaskId(null);
    setEditedTaskName('');
    setEditedTaskDeadline('');
  };

  const deleteTask = (taskId) => {
    const taskRef = ref(database, `lists/${listId}/tasks/${taskId}`);
    remove(taskRef);
  };

  return (
    <div>
      <Link to={`/`}>{'<'} Back</Link>
      <EditListName listName={listName} setListName={setListName} /> {/* Use the new component */}
      <div className="newTask">
        <input
          className="fullInput"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <input
          className="fullInput"
          type="date"
          value={newTaskDeadline}
          onChange={(e) => setNewTaskDeadline(e.target.value)}
          placeholder="Deadline (optional)"
        />
        <button onClick={addTask} className="add">
          + Add
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <>
                <div className="task-content">
                  <input
                    className="fullInput"
                    type="text"
                    value={editedTaskName}
                    onChange={(e) => setEditedTaskName(e.target.value)}
                  />
                  <input
                    className="fullInput"
                    type="date"
                    value={editedTaskDeadline}
                    onChange={(e) => setEditedTaskDeadline(e.target.value)}
                  />
                </div>
                <div className="task-actions">
                  <button onClick={() => saveTask(task.id)}>Save</button>
                  <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="task-content">
                  <label>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTaskDone(task.id, !task.done)}
                    />
                  </label>
                  <span onClick={() => startEditing(task)}>
                    {task.name}
                    <br />
                    {task.deadline && (
                      <span className="subDate">
                        Deadline:{' '}
                        {new Date(task.deadline).toLocaleDateString('en-GB')}
                      </span>
                    )}
                  </span>
                </div>
                <div className="task-actions">
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                  <button onClick={() => startEditing(task)}>Edit</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListDetail;