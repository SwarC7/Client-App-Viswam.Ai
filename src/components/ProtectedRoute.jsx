import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";
import React from "react";


export default function ProtectedRoute({ children }){
  return isAuthed() ? children : <Navigate to="/login" replace />;
}
