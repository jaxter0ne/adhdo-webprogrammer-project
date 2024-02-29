import React, { useState } from 'react';
import { ref, remove } from 'firebase/database';
import { database } from './firebase-config';
import { useNavigate } from 'react-router-dom';

function DeleteListButton({ listId, onListDeleted }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const deleteList = () => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      // setIsLoading(true);
      const listRef = ref(database, `lists/${listId}`);
  
      remove(listRef)
        .then(() => {
          // if (onListDeleted) {
          //   onListDeleted(listId);
          // }
          navigate('/');
        })
        .catch((error) => {
          console.error('Error deleting list:', error);
        })
        .finally(() => {
          // setIsLoading(false);
          // navigate('/');
        });
    }
  };

  return (
    <button type="button" className='delete' onClick={deleteList} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Delete'}
    </button>
  );
}

export default DeleteListButton;