// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { database } from './firebase-config';
import { onValue, ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';
import ListProgress from './ListProgress';
import { formatDistanceToNow } from 'date-fns';
import cardBg from './img/card-bg.svg';


// Define the ToDoNext component
function ToDoNext({ lists }) {
  // Initialize state variables
  const [allTasks, setAllTasks] = useState([]);
  const [closestTasks, setClosestTasks] = useState([]);

  // Fetch tasks from the database when the component mounts or when the lists prop changes
  useEffect(() => {
    const fetchTasks = async () => {
      let tasks = [];
  
      // Loop through each list
      for (let list of lists) {
        // Get a reference to the tasks in the current list
        const tasksRef = ref(database, `lists/${list.id}/tasks`);
        // Fetch the tasks
        const snapshot = await get(tasksRef);
        const data = snapshot.val();
        if (data) {
          // Add the fetched tasks to the tasks array, filtering out tasks that are done
          tasks = [...tasks, ...Object.keys(data)
            .map((key) => ({ id: key, listId: list.id, listName: list.name, ...data[key] }))
            .filter((task) => !task.done)];
        }
      }
  
      // Update the allTasks state variable
      setAllTasks(tasks);
    };
  
    fetchTasks();
  }, [lists]);

  // Determine the closest tasks when the allTasks state variable changes
  useEffect(() => {
    const tasks = [...allTasks];
    // Filter out tasks without a deadline
    const tasksWithDeadline = tasks.filter(task => task.deadline);
    // Sort the tasks by deadline
    tasksWithDeadline.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    // Update the closestTasks state variable with the two tasks that have the closest deadlines
    setClosestTasks(tasksWithDeadline.slice(0, 2));
  }, [allTasks]);
  

  // Render the component
  return (
  <><h2>To do next</h2>
    <div className="to-do-next">
      {/* Map over each of the closest tasks */}
      {closestTasks.map((task) => (
        // Link to the list that the task belongs to
        <Link to={`/list/${task.listId}`} key={task.id}>
          <div className="card-menu">
            {/* Change the background color of the card if the deadline is in the past */}
            <div className={`card-menu-background${new Date(task.deadline) < new Date() ? '-past-deadline' : '-wrapper'}`}>
              <div className="card-menu-background">
              <img alt="Background Ellipses" src={cardBg} />
              </div>
            </div>
            <div className="frame">
              <div className="card-menu-deadline-wrapper">
                <div className="card-menu-deadline">
                  {/* Change the color of the text if the deadline is in the past */}
                  <div className="para-primary-center" style={{ color: new Date(task.deadline) < new Date() ? '#e9002b' : 'inherit' }}>
                    {/* Display the time until the deadline */}
                    Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="card-menu-title">
                {/* Display the name of the list and the task */}
                <div className="text-wrapper">{task.listName}</div>
                <p className="div">{task.name.length > 25 ? task.name.substring(0, 25) + '...' : task.name}</p>              </div>
              <div className="card-menu-progress">
                <div className="para-primary-center-2">Project Progress</div>
                {/* Display the progress of the list. If it's past deadline, style the background of the bar to be red */}
                <ListProgress 
                  listId={task.listId} 
                  progressBarColor={`${new Date(task.deadline) < new Date() ? '#770909' : '#004797'}`}
                  progressBarDoneColor="white" 
                  labelColor="white" 
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </>
  );
}

// Export the ToDoNext component
export default ToDoNext;