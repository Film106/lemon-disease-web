import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Capture from '../pages/Capture';
import Result from '../pages/Result';
import { LoadingState } from '../components/ui/LoadingState';

const History = lazy(() => import('../pages/History'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/capture" element={<Capture />} />
      <Route path="/result" element={<Result />} />
      <Route
        path="/history"
        element={
          <Suspense fallback={<LoadingState fullScreen />}>
            <History />
          </Suspense>
        }
      />
    </Routes>
  );
}
