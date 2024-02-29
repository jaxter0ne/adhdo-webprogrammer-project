import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, onValue, update, remove } from 'firebase/database';
import DeleteListButton from './DeleteListButton';
import ListProgress from './ListProgress';

function EditListName({ listName, setListName, onDeleteList }) {
  const { listId } = useParams();
  const [editingList, setEditingList] = useState(false);
  const [originalListName, setOriginalListName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const listRef = ref(database, `lists/${listId}`);
    onValue(listRef, (snapshot) => {
      const data = snapshot.val() || {};
      setOriginalListName(data.name);
    });
  }, [listId]);

  const startEditingList = () => {
    setEditingList(true);
  };

  const saveListName = (e) => {
    e.preventDefault(); // prevent form from refreshing the page
    const listRef = ref(database, `lists/${listId}`);
    update(listRef, { name: listName }).then(() => {
      setEditingList(false);
    });
  };
  const cancelEditingList = () => {
    setListName(originalListName);
    setEditingList(false);
  };

  const deleteList = () => {
      if (window.confirm('Are you sure you want to delete this list?')) {
    const listRef = ref(database, `lists/${listId}`);
    const tasksRef = ref(database, 'tasks');

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      for (let taskId in data) {
        if (data[taskId].listId === listId) {
          const taskRef = ref(database, `tasks/${taskId}`);
          remove(taskRef);
        }
      }
    });

    remove(listRef);
    navigate('/');
  }
  };

  return (<>
    <div className="titleBar">
      {editingList ? (
        <form onSubmit={saveListName}>
          <div className='task-content'>
          <input
            className="fullInput"
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          </div>
          <div className='task-actions'>
          <DeleteListButton listId={listId} onListDeleted={onDeleteList} />
            <button type="submit">Save</button>
            <button type="button" onClick={cancelEditingList}>Cancel</button>
          </div>  
        </form>
      ) : (
        <>
          <h2 onClick={startEditingList}>{listName || 'Tasks'}</h2>
          <button onClick={startEditingList}>Edit List</button>
        </>
      )}
    </div>
   </>
  );
}

export default EditListName;