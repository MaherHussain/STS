import { Routes, Route } from "react-router-dom";
import {Login, AdminDashboard, Home} from "../pages/";
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}