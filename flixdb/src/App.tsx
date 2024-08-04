import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import Footer from './components/Footer';
import Profile from './components/Profile';
import UploadMoviePage from './pages/UploadMovie'; 
import MyMoviesPage from './pages/MyMoviesPage'; 
import { CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; 

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/movies/:id" element={<MovieDetail />} />
                  <Route path="/upload" element={<UploadMoviePage />} /> 
                  <Route path="/mymovies" element={<MyMoviesPage />} /> 
                </Routes>
              </Container>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
