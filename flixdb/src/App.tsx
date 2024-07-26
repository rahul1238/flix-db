// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import Footer from './components/Footer';
import Profile from './components/Profile';
import { CustomThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
    <Router>
      <div className="App">
        <Header />
        <main>
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
          </Routes>
        </Container>
        </main>
        <Footer />
      </div>
      </Router>
      </CustomThemeProvider>
  );
}

export default App;
