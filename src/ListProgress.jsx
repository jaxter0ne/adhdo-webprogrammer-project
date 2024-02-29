import React, { useEffect, useState } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from 'firebase/database';
import ProgressBar from './ProgressBar';

const ListProgress = ({ listId, progressBarColor, progressBarDoneColor, labelColor }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const listRef = ref(database, `lists/${listId}`);
    
      onValue(listRef, (snapshot) => {
        const list = snapshot.val();
    
        if (list && list.name) {
          const tasksRef = ref(database, `lists/${listId}/tasks`);
    
          onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const tasks = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
              if (tasks.length > 0) {
                const doneTasks = tasks.filter(task => task.done).length;
                const totalTasks = tasks.length;
                const progress = (doneTasks / totalTasks) * 100;
    
                setProgress(progress);
              }
            }
          });
        }
      });
    }, [listId]);

  return (
    <ProgressBar 
      progressPercentage={progress} 
      progressBarColor={progressBarColor} 
      progressBarDoneColor={progressBarDoneColor} 
      labelColor={labelColor} 
    />
  );
};

export default ListProgress;