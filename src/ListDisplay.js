import React from 'react';
import { Link } from 'react-router-dom';

const ListDisplay = ({ lists }) => (
  <ul>
    {lists.map(list => (
      <li key={list.id}>
        <Link to={`/list/${list.id}`}>{list.name}</Link>
      </li>
    ))}
  </ul>
);

export default ListDisplay;