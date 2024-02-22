import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { database } from './firebase-config';
import { ref, update } from 'firebase/database';

const ListDisplay = ({ lists }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedListName, setEditedListName] = useState('');

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
              </div>
            </>
          ) : (
            <>
              <div className="taskLabel">
                <Link to={`/list/${list.id}`}>{list.name}</Link>
              </div>
              <div className="task-actions">
                <button onClick={() => startEditing(list.id, list.name)}>
                  Edit
                </button>
                {'>'}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListDisplay;
