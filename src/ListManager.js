import React, { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';

function ListManager({ onListAdded }) {
  const [listName, setListName] = useState('');

  const handleAddList = () => {
    const database = getDatabase();
    const listRef = ref(database, 'lists');
    const newListRef = push(listRef);
    set(newListRef, { name: listName, tasks: {} });
    setListName('');
    onListAdded();
  };

  return (
    <div>
      <h2>My Lists</h2>
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="New list name"
      />
      <button onClick={handleAddList}>Add List</button>
    </div>
  );
}

export default ListManager;
