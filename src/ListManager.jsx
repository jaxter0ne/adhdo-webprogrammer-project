import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, remove, onValue } from 'firebase/database';
import ToDoNext from './ToDoNext';
import OpenAI from "openai";
import { useNavigate } from 'react-router-dom';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  organization: 'org-Ot6bgg4GUfwLYT8BxP9AY3jI', apiKey: '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', dangerouslyAllowBrowser: true,
});

function ListManager({ onListAdded }) {
  const [listName, setListName] = useState('');
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

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
        messages: [{ role: "system", content: `Divide the project "${listName}" into smaller tasks each separated by a semicolon.` }],
        model: "gpt-3.5-turbo",
      });
  
      // Extract the content string
      const content = completion.choices[0].message.content;

      console.log(content); // Log the content string (for debugging purposes
  
      // Split the content string into individual tasks
      const tasks = content.split(';');
  
      // Add each task to the list
      tasks.forEach((task, index) => {
        const taskRef = push(ref(database, `lists/${newListRef.key}/tasks`));
        set(taskRef, { name: task.trim(), done: false });
      });

      // Redirect to the list detail
      navigate(`/list/${newListRef.key}`);

    } catch (error) {
      console.error('Fetch error:', error);
    }
  
    onListAdded();
    setIsCreating(false); // Set isCreating to false after list creation is complete
  };

  return (
    <div>
      <ToDoNext lists={lists} /> {/* Add ToDoNext component */}
      <h2>My Projects</h2>
      <div className="newTask">
        <input
          className="fullInput"
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="New project name"
        />
        {isCreating ? (
          <div>Loading...</div> // Render loading message if list is being created
        ) : (
          <button className="add" onClick={handleAddList}>+ Create</button> // Render create button if list is not being created
        )}
      </div>
    </div>
  );
}

export default ListManager;