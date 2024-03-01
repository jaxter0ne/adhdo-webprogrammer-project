import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { database } from './firebase-config';
import { ref, onValue, remove } from 'firebase/database';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import ListManager from './ListManager';
import ListDetail from './ListDetail';
import TaskDetail from './TaskDetail';
import ListsDisplay from './ListsDisplay';
import './App.scss';
import ToDoNext from './ToDoNext';
import { deleteListButton } from './DeleteListButton';
import LoginPage from './LoginPage';
import UserContext from './UserContext'; // import UserContext

function App() {
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

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

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      setUser(null);
      navigate('/login');
    }).catch((error) => {
      // An error happened.
      console.error(error);
    });
  };

  function ListDetailWrapper() {
    const { listId } = useParams();
    const list = lists.find(list => list.id === listId);

    return <ListDetail list={list} />;
  }
 // PrivateRoute component
 function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => (user ? children : <Navigate to="/login" replace />)}
    />
  );
}

return (
  <UserContext.Provider value={user}>
    <div className="app">
    {user && ( // Only render ListManager if user is signed in
        <div className="floatingButton">
          <ListManager onListAdded={onListAdded} lists={lists} />
        </div>
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            user ? (
              <>
                <div className="titleBar"><h1>Welcome, {user ? user.displayName : 'Guest'}</h1>
                <button type="button" onClick={handleLogout}>Logout</button></div> {/* Logout button */}
                <ToDoNext lists={lists} />
                <ListsDisplay lists={lists} onDeleteList={onListDeleted} />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/list/:listId"
          element={user ? <ListDetailWrapper onDeleteList={onListDeleted} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/list/:listId/task/:taskId"
          element={user ? <TaskDetail /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  </UserContext.Provider>
);
}

export default App;