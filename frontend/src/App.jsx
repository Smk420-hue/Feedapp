import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import AuthContext from './components/context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './components/pages/HomePage';
import AdminPage from './components/pages/AdminPage';
import Navbar from './components/Navbar';
import CreatePost from './components/Feed/CreatePost';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/create-post" element={<CreatePost/>}/>
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;