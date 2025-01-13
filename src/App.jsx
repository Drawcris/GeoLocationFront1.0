import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute"; 
import ProtectedRouteDriver from './ProtectredRoudeDriver';
import LoginPage from "./pages/LoginPage";
import SignPage from "./pages/SignPage";
import SearchPage from "./pages/SearchPage";
import UsersPage from "./pages/UsersPage";
import AddRoute from "./pages/AddRoute";
import ProfilePage from "./pages/ProfilePage";
import CreatorPage from "./pages/CreatorPage";
import RoutingPage from "./pages/RoutingPage";
import GoogleRoutingPage from "./pages/GoogleRoutingPage";
import Home from "./pages/Home";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AuthProvider } from './context/AuthContext';

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <SidebarTrigger />
              <main className="flex-1 p-4 overflow-auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="loginpage" element={<LoginPage />} />
                  <Route path="signpage" element={<SignPage />} />
                  <Route
                    path="/userPage"
                    element={
                      <ProtectedRoute>
                        <UsersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="searchpage" element={<SearchPage />} />
                  <Route
                    path="/addRoute"
                    element={
                      <ProtectedRoute>
                        <AddRoute />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="googleRoutingPage" element={<GoogleRoutingPage />} />
                  <Route path="profilePage" element={<ProfilePage />} />
                  <Route path="creatorPage" element={<CreatorPage />} />
                  <Route path="routingPage" 
                         element={
                         <ProtectedRouteDriver>
                         <RoutingPage />
                         </ProtectedRouteDriver>
                         } 
                         />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;