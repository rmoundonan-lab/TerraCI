import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LandDetail from './pages/LandDetail';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Map from './pages/Map';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Store
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/land/:id" element={<LandDetail />} />
              <Route path="/map" element={<Map />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

              {/* Protected Routes */}
              {isAuthenticated && (
                <>
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/chat/*" element={<Chat />} />
                  <Route path="/admin/*" element={<Admin />} />
                </>
              )}

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
