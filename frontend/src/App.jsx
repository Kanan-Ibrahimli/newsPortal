import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from './components/common/footer';

import Login from './auth/login';
import ProtectedRoute from './auth/ProtectedRoute';
import Header from './components/common/header';
import AdminSidebar from './components/sidebar/AdminSidebar';
import EditorSidebar from './components/sidebar/EditorSidebar';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/AdminDashboard';
import EditorDashboard from './pages/EditorDashboard';
import Register from './auth/register';
import Logout from './auth/Logout';
import Users from './pages/users';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import Nav from './components/navBar/categoryNav';
import CreateArticlePage from './pages/CreateArticlePage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';

function Pages() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Routes>
      {/* Admin Protected Route */}
      <Route
        path="/users"
        element={
          <ProtectedRoute role="admin">
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute role="admin">
            <EditorDashboard role={'admin'} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/article/new"
        element={
          <ProtectedRoute role="editor">
            <CreateArticlePage />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/article/edit/:id"
        element={
          <ProtectedRoute role="editor">
            <ArticleEditorPage />
          </ProtectedRoute>
        }
      />
      {/* Main Routes */}
      <Route
        path="/"
        element={
          user ? (
            user?.role === 'admin' ? (
              <AdminDashboard />
            ) : user?.role === 'editor' ? (
              <EditorDashboard />
            ) : (
              <Homepage />
            )
          ) : (
            <Homepage /> // For unauthenticated users (guest users)
          )
        }
      />

      {/* Additional Routes */}
      <Route path="/*" element={<>Not found</>} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/article/:id" element={<ArticlePage />} />
      <Route path="/articles/:category" element={<CategoryPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

function Routing() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // Define routes where no sidebar is required
  const noSidebarRoutes = ['/auth/login', '/auth/register', '/about'];
  // Define routes where the Nav should not be shown
  const noNavRoutes = ['/auth/login', '/auth/register', '/about'];
  const shouldShowNav =
    !noNavRoutes.some((route) => location.pathname.startsWith(route)) &&
    !location.pathname.startsWith('/article/'); // Hide Nav for /article/:id
  // Check if the current route should have no sidebar
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

  // Function to render the appropriate sidebar based on the user's role
  const renderSidebar = () => {
    if (user?.role === 'admin') {
      return <AdminSidebar />;
    } else if (user?.role === 'editor') {
      return <EditorSidebar />;
    } else {
      return null; // No sidebar for readers or unauthenticated users
    }
  };

  if (location.pathname === '/auth/login') {
    return (
      <div className="">
        <Header />
        <Login />
      </div>
    );
  }

  return (
    <div>
      {/* Show Header if sidebar is enabled */}
      <Header />
      {/* Categories Navigation */}

      {(user?.role == 'reader' || user == null) && (
        <>{shouldShowNav && <Nav />}</>
      )}

      <div className="flex mb-16">
        {/* Sidebar logic */}
        {shouldShowSidebar && (
          <div className="flex">
            <div className="hidden lg:block">{renderSidebar()}</div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`lg:px-4 ${
            shouldShowNav ? 'mt-6' : 'mt-6'
          } flex mx-auto justify-center items-start w-full ${
            shouldShowSidebar ? 'lg:w-[79.6vw]' : 'w-full'
          } p-2 overflow-hidden lg:pb-4`}
        >
          <Pages />
        </div>
      </div>
      <Footer />
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <Routing />
  </BrowserRouter>
);

export default App;
