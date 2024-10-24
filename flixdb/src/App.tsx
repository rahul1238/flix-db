import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Home from './components/Home';
import MovieDetail from './pages/MovieDetail';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import UploadMoviePage from './forms/UploadMovie';
import ResetPassword from './forms/ResetPassword';
import MyMoviesPage from './pages/MyMoviesPage';
import { CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NavProvider } from './context/NavContext';
import Help from './components/Help';
import About from './components/About';
const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <NavProvider>
          <Router>
            <Box className="App" display="flex" flexDirection="column" minHeight="100vh">
              <Header />
              <Box component="main" flexGrow={1} py={4}>
                <Container>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/movies/:id" element={<MovieDetail />} />
                    <Route path="/upload" element={<UploadMoviePage />} />
                    <Route path="/mymovies" element={<MyMoviesPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </Container>
              </Box>
              <Footer />
            </Box>
          </Router>
        </NavProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;
