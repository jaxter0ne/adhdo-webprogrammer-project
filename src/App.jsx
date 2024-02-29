import React, { useEffect, useState } from 'react';
import { database } from './firebase-config';
import { ref, onValue, remove } from 'firebase/database';
import { Routes, Route, useParams } from 'react-router-dom';
import ListManager from './ListManager';
import ListDetail from './ListDetail';
import TaskDetail from './TaskDetail';
import ListsDisplay from './ListsDisplay';
import './App.scss';
import ToDoNext from './ToDoNext';
import { deleteListButton } from './DeleteListButton';

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

  const onListDeleted = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  function ListDetailWrapper() {
    const { listId } = useParams();
    const list = lists.find(list => list.id === listId);

    return <ListDetail list={list} />;
  }

  return (
    <div className="app">
      <div className="floatingButton">
      <ListManager onListAdded={onListAdded} lists={lists} />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Welcome, Nad</h1>
              <ToDoNext lists={lists} />
              <ListsDisplay lists={lists} onDeleteList={onListDeleted} />
            </>
          }
        />
        <Route path="/list/:listId" element={<ListDetailWrapper onDeleteList={onListDeleted} />} />
        <Route path="/list/:listId/task/:taskId" element={<TaskDetail />} />
      </Routes>
    </div>
  );
}

export default App;