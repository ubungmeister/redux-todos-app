import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TasksPage } from '@/pages/TasksPage';
import { ErrorPage } from '@/pages/ErrorPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TasksPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
