import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import EditListName from './EditListName'; // Import the new component
import ListProgress from './ListProgress';
import ToDoNext from './ToDoNext';


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
  const [lists, setLists] = useState([]);


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
        const data = snapshot.val() || {};
        setLists(Object.keys(data).map((key) => ({ id: key, ...data[key] })));
      }
      setTasks(loadedTasks);
    });
  }, [listId]);

  const addTask = () => {
    let deadline = newTaskDeadline;
    if (deadline && !deadline.includes('T')) {
      deadline += 'T09:00';
    }
  
    const taskRef = ref(database, `lists/${listId}/tasks`);
    const newTaskRef = push(taskRef);
    set(newTaskRef, {
      name: newTask,
      deadline: deadline || null,
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
    let deadline = editedTaskDeadline;
    if (deadline && !deadline.includes('T')) {
      deadline += 'T09:00';
    }
  
    const taskRef = ref(database, `lists/${listId}/tasks/${taskId}`);
    update(taskRef, {
      name: editedTaskName,
      deadline: deadline || null,
    });
    setEditingTaskId(null);
    setEditedTaskName('');
    setEditedTaskDeadline('');
  };

  const deleteTask = (taskId) => {
    const taskRef = ref(database, `lists/${listId}/tasks/${taskId}`);
    remove(taskRef);
  };

  const doneTasks = tasks.filter(task => task.done).length;
  const totalTasks = tasks.length;
  // const progressPercentage = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;


  return (
    <div>
      <Link to={`/`}>{'<'} Back</Link>
      <EditListName listName={listName} setListName={setListName}  /> {/* Component to show list name and edit it when clicked */}
      <div className='titleProgress'>
        <span className='label-left'>Project Progress</span>
        <ListProgress listId={listId} />
      </div>
      <div className='progressPadding'>
      <ToDoNext lists={[{
        id: listId,
        name: listName,
      }]} /> 
      </div>
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
    type="datetime-local"
    value={newTaskDeadline}
    onChange={(e) => setNewTaskDeadline(e.target.value)}
    placeholder="Deadline (optional)"
  />
  <button onClick={addTask} className="add">
    + Add
  </button>
</div>
      <ul>
      {tasks
          .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
          .map((task) => (
            <li key={task.id} className="task-content">
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
      type="datetime-local"
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
                    {task.duration && (
                      <span className="subDate">
                        Estimated duration: {Math.floor(task.duration / 3600000) > 0 ? `${Math.floor(task.duration / 3600000)} hours ` : ''}
                        {Math.floor((task.duration % 3600000) / 60000)} minutes
                      <br/></span>
                    )}
                    {task.deadline && (
                      <span className="subDate">
                        Due {new Date(task.deadline).toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })} at {new Date(task.deadline).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
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