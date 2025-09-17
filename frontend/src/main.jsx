import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import axios from 'axios';
axios.defaults.withCredentials = true; 
import EditListing from './pages/EditListing.jsx';
// Import Global State Provider
import { AuthProvider } from './context/AuthContext.jsx';

// Import Components and Pages
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import CreateListing from './pages/CreateListing.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MyListings from './pages/MyListings.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public Routes
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'listings/:listingId',
        element: <ListingDetail />,
      },
      
      // Protected Routes
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'create-listing',
            element: <CreateListing />,
          },
          { 
            path: 'my-listings',
            element: <MyListings />,
          },
          { // Add this new protected route
            path: 'edit-listing/:listingId',
            element: <EditListing />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);