import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, onValue, update } from 'firebase/database';

function EditListName({ listName, setListName }) {
  const { listId } = useParams();
  const [editingList, setEditingList] = useState(false);
  const [originalListName, setOriginalListName] = useState('');

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
    update(listRef, { name: listName });
    setEditingList(false);
  };

  const cancelEditingList = () => {
    setListName(originalListName);
    setEditingList(false);
  };

  return (
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
  );
}

export default EditListName;