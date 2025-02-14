import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LandingPage from './components/LandingPage';
import GameComponent from './components/GameComponent';
import CompletionPage from './components/CompletionPage';
import LostGamePage from './components/LostGamePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GameComponent />} />
          <Route path="/completion" element={<CompletionPage />} />
          <Route path="/lost-game" element={<LostGamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;