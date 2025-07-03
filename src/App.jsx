import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayerRegistration from './pages/PlayerRegistration';
import IdCardDetails from './pages/IdCardDetails';
// import PlayerList from './pages/PlayerList';
// import PlayerDetails from './pages/PlayerDetails';
import ScreenReader from './components/ScreenReader';
import AccessibilityHelp from './components/AccessibilityHelp';

function App() {
  return (
    <ScreenReader>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Skip link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          <Navbar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<PlayerRegistration />} />
              <Route path="/id-card-details" element={<IdCardDetails />} />

            </Routes>
          </main>
          
          {/* Accessibility Help */}
          <AccessibilityHelp />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#374151',
                color: '#fff',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#065f46',
                  border: '1px solid #10b981',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#7f1d1d',
                  border: '1px solid #ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </ScreenReader>
  );
}

export default App;
