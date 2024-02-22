import React from 'react';
import { useNavigate } from 'react-router-dom';

function ListLink({ listId, listName }) {
  let navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/list/${listId}`)}>
      {listName}
    </button>
  );
}

export default ListLink;