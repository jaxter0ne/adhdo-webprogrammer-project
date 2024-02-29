import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, remove, onValue } from 'firebase/database';
import OpenAI from "openai";
import { useNavigate } from 'react-router-dom';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({
  organization: 'org-Ot6bgg4GUfwLYT8BxP9AY3jI', 
  apiKey: OPENAI_API_KEY,  
  dangerouslyAllowBrowser: true,
});

function ListManager({ onListAdded }) {
  const [listName, setListName] = useState('');
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  const [showNewTask, setShowNewTask] = useState(false);


  useEffect(() => {
    const database = getDatabase();
    const listsRef = ref(database, 'lists');
    onValue(listsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setLists(Object.keys(data).map((key) => ({ id: key, ...data[key] })));
    });
  }, []);

  const [isCreating, setIsCreating] = useState(false); // Add this line

  const handleAddList = async () => {
    setIsCreating(true); // Set isCreating to true at the start of list creation
  
    const database = getDatabase();
    const listRef = ref(database, 'lists');
    const newListRef = push(listRef);
    set(newListRef, { name: listName, tasks: {} });
    setListName('');
  
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `Give me a JSON that divides the project "${listName}" into smaller tasks, and evaluate the duration in milliseconds (called "duration" and only contains a number) of each task.` }],
        model: "gpt-3.5-turbo",
      });
  
      // Parse the content string into a JSON object
      const content = JSON.parse(completion.choices[0].message.content);

      console.log(content);
  
      // Extract the project name and tasks
      const { project: name, tasks } = content;

      // Initialize the total duration
      let totalDuration = 0;
  
      // Add each task to the list
      tasks.forEach((taskObj, index) => {
        const { task, duration } = taskObj;

        // Convert the duration to milliseconds
        const durationMs = Number(duration)

        // Calculate the deadline
        const deadline = new Date(Date.now() + totalDuration + durationMs);

        // Update the total duration
        totalDuration += durationMs;

        const taskRef = push(ref(database, `lists/${newListRef.key}/tasks`));
        // Add durationMs as its own key for each task
        set(taskRef, { name: task, done: false, deadline: deadline.toISOString(), duration: durationMs });
      });
  
      // Redirect to the list detail
      navigate(`/list/${newListRef.key}`);
  
    } catch (error) {
      console.error('Fetch error:', error);
    }
  
    onListAdded();
    setIsCreating(false); // Set isCreating to false after list creation is complete
  };

  const handleToggleNewTask = () => {
    setShowNewTask(!showNewTask); // Toggle the showNewTask state variable
  };
  
  return (
    <div className="taskContainer">
    {showNewTask && (
      <div className="newTask">
        <input
          className="fullInput"
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Describe a new project here..."
        />
        {isCreating ? (
          <div>Loading...</div> // Render loading message if list is being created
        ) : (
          <button className="add" onClick={handleAddList}>+ Create</button> // Render create button if list is not being created
        )}
      </div>
    )}
    <button 
      className="roundPlusButton" 
      onClick={handleToggleNewTask}
    >
      {showNewTask ? '–' : '+'}
    </button>
  </div>
);
}

export default ListManager;