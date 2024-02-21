import React, { useEffect, useState } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from 'firebase/database';
import { Routes, Route } from 'react-router-dom';
import ListManager from './ListManager';
import ListDetail from './ListDetail';
import TaskDetail from './TaskDetail';
import ListDisplay from './ListDisplay';
import './App.scss';

function App() {
  const [lists, setLists] = useState([]);

  const fetchLists = () => {
    const listsRef = ref(database, 'lists');
    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedLists = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setLists(loadedLists);
    });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const onListAdded = () => {
    fetchLists(); // Re-fetch lists to update UI after a new list is added
  };

  return (
    <div className="app">
      <h1>ADHDo</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ListManager onListAdded={onListAdded} />
              <ListDisplay lists={lists} />
            </>
          }
        />
        <Route path="/list/:listId" element={<ListDetail />} />
        <Route path="/list/:listId/task/:taskId" element={<TaskDetail />} />
      </Routes>
    </div>
  );
}

export default App;
