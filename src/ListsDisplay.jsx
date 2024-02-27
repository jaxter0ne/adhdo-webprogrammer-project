import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, update, onValue, remove } from 'firebase/database'; 
import ProgressBar from './ProgressBar';
import ListProgress from './ListProgress';


const ListDisplay = ({ lists, onDeleteList }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editedListName, setEditedListName] = useState('');
  const [progressPercentages, setProgressPercentages] = useState({});
  const deleteList = (listId) => {
    onDeleteList(listId);
  };

  useEffect(() => {
    setIsLoading(true); // Set loading to true at the start of data fetch

    lists.forEach((list) => {
      const tasksRef = ref(database, `lists/${list.id}/tasks`);

      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        const tasks = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
        const doneTasks = tasks.filter(task => task.done).length;
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

        setProgressPercentages(prev => ({ ...prev, [list.id]: progress }));

        const listRef = ref(database, `lists/${list.id}`);
        update(listRef, { progress });

        setIsLoading(false); // Set loading to false after data has been processed
      });
    });
  }, [lists]);

  const startEditing = (listId, currentName) => {
    setIsEditing(listId);
    setEditedListName(currentName);
  };

  const saveListName = (listId) => {
    const listRef = ref(database, `lists/${listId}`);
    update(listRef, { name: editedListName });
    setIsEditing(null);
    setEditedListName('');
  };

  const navigate = useNavigate();
  
  if (isLoading) {
    return <div>Loading...</div>; // Render loading message if data is being fetched
  }

  return (
    <ul>
      {lists.map((list) => (
        <li key={list.id}>
          {isEditing === list.id ? (
            <>
              <div className="task-content">
                <input
                  className="fullInput"
                  type="text"
                  value={editedListName}
                  onChange={(e) => setEditedListName(e.target.value)}
                />
              </div>
              <div className="task-actions">
                <button onClick={() => saveListName(list.id)}>Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
                <button onClick={() => deleteList(list.id)}>Delete</button> {/* Add delete button */}
              </div>
            </>
          ) : (
            <>
              
                <div className="taskLabel">
                <Link to={`/list/${list.id}`}>
                <div>{list.name}</div>
                <div className='listProgressPadding'><ListProgress listId={list.id} /></div>
                </Link>
              </div>
            
              <div className="task-actions">
                <button onClick={() => startEditing(list.id, list.name)}>
                  Edit
                </button>
                <button onClick={() => navigate(`/list/${list.id}`)}>
                  {'>'}
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListDisplay;