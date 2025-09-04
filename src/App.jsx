import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Contributions from "./pages/Contributions";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthed } from "./lib/auth";
import React from "react";


function HomeRedirect(){
  const authed = isAuthed();
  return <Navigate to={authed ? "/profile" : "/login"} replace />;
}

export default function App(){
  return (
    <div className="app-shell">
      <Nav />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        }/>
        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        }/>
        <Route path="/contributions" element={
          <ProtectedRoute><Contributions /></ProtectedRoute>
        }/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
