import React, { useEffect, useState } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from 'firebase/database';
import { Routes, Route, useParams } from 'react-router-dom';
import ListManager from './ListManager';
import ListDetail from './ListDetail';
import TaskDetail from './TaskDetail';
import ListsDisplay from './ListsDisplay';
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

  function ListDetailWrapper() {
    const { listId } = useParams();
    const list = lists.find(list => list.id === listId);

    return <ListDetail list={list} />;
  }

  return (
    <div className="app">
      <h1>ADHDo</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
               <ListManager onListAdded={onListAdded} lists={lists} />
              <ListsDisplay lists={lists} />
            </>
          }
        />
        <Route path="/list/:listId" element={<ListDetailWrapper />} />
        <Route path="/list/:listId/task/:taskId" element={<TaskDetail />} />
      </Routes>
    </div>
  );
}

export default App;