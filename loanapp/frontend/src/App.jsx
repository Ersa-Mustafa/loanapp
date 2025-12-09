import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ClientHome from './client/ClientHome';
import Login from './client/auth/Login';
import Register from './client/auth/Register';
import ApplyLoan from "./client/ApplyLoan";
import EditProfile from "./client/EditProfile";
import EditLoan from "./client/EditLoan";
import ViewLoan from "./client/ViewLoan";
import EmployeeHome from "./employee/EmployeeHome";
import EmployeeLogin from "./employee/auth/Login";
import ViewLoanEmp from "./employee/ViewLoan";
import Reports from "./employee/Reports";
import EditProfileEmp from "./employee/EditProfile";
import ForgetPassword from "./client/auth/ForgetPassword";

function App() {
    return (
        <>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot_password" element={<ForgetPassword />} />
            <Route path="/client/home" element={<ClientHome />} />
            <Route path="/client/apply" element={<ApplyLoan />} />
            <Route path="/client/profile" element={<EditProfile />} />
            <Route path="/client/loans/:id" element={<EditLoan />} />
            <Route path="/client/loans/:id/readonly" element={<ViewLoan />} />
            <Route path="/employee/home" element={<EmployeeHome />} />
            <Route path="/employee_login" element={<EmployeeLogin />} />
            <Route path="/employee/loans/:id" element={<ViewLoanEmp />} />
            <Route path="/employee/reports" element={<Reports />} />
            <Route path="/employee/profile" element={<EditProfileEmp />} />
        </Routes>
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        </>
    );
}

export default App;