import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  let navigate = useNavigate();
  let { listId, taskId } = useParams();

  return (
    <div>
      <h2>Task Details (Task ID: {taskId})</h2>
      {/* Display your task details here */}
      <button onClick={() => navigate(`/list/${listId}`)}>Back to List</button>
    </div>
  );
}

export default TaskDetail;