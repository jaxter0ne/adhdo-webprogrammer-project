import React, { useState, useEffect, useContext } from 'react'; // import useContext
import { Link, useNavigate } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, update, onValue, remove } from 'firebase/database'; 
import ListProgress from './ListProgress';
import DeleteListButton from './DeleteListButton';
import UserContext from './UserContext'; // import UserContext


const ListDisplay = ({ lists, onDeleteList }) => {
  const user = useContext(UserContext); // access user from context
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editedListName, setEditedListName] = useState('');
  const [progressPercentages, setProgressPercentages] = useState({});
  

  useEffect(() => {
    setIsLoading(true); // Set loading to true at the start of data fetch

    lists.forEach((list) => {
      const tasksRef = ref(database, `lists/${list.id}/tasks`);

      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        const tasks = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];

        if (tasks.length === 0) return;
        
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
  <>
  <h2>My Projects</h2>
    <ul>
    {lists.filter(list => list.userId === user.uid).map((list) => ( // filter lists by user ID
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
                <DeleteListButton listId={list.id} onListDeleted={onDeleteList} />
                <button onClick={() => saveListName(list.id)}>Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              
                <div className="taskLabel">
                <Link to={`/list/${list.id}`}>
                <div>{list.name} {">"}</div>
                <div className='listProgressPadding'><ListProgress listId={list.id} /></div>
                </Link>
              </div>
            
              <div className="task-actions">
                <button onClick={() => startEditing(list.id, list.name)}>
                  Edit
                </button>
                {/* <button onClick={() => navigate(`/list/${list.id}`)}>
                  {'>'}
                </button> */}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
    </>
  );
};

export default ListDisplay;