import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes';

import './styles/global.css';
import './styles/dashboard.css';
import './styles/forms.css';
import './styles/responsive.css';

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <div className="app-container modern-layout">
          <div className="main-content-wrapper">
            <Navbar />
            <main className="content-area">
              <AppRoutes />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
