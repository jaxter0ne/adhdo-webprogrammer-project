import React, { useEffect, useState } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from 'firebase/database';
import ProgressBar from './ProgressBar';

const ListProgress = ({ listId, progressBarColor, progressBarDoneColor, labelColor }) => {
    const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tasksRef = ref(database, `lists/${listId}/tasks`);

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasks = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      const doneTasks = tasks.filter(task => task.done).length;
      const totalTasks = tasks.length;
      const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

      setProgress(progress);
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