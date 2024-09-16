import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import {UnauthenticatedRoute} from "./security/UnauthenticatedRoute.tsx";
import {AuthProvider} from "./security/AuthContext.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import {AuthenticatedRoute} from "./security/AuthenticatedRoute.tsx";
import Layout from "./components/shared/Layout.tsx";


const theme = createTheme({
    palette: {
        primary: {
            main: "#FBC40E",
        },
        secondary: {
            main: "#343F71",
            contrastText: 'white'
        },
    },
});

const router = createBrowserRouter([
    {path:"/signin", element: <UnauthenticatedRoute><SignInPage/></UnauthenticatedRoute>},
    {path:"/signup", element: <UnauthenticatedRoute><SignUpPage/></UnauthenticatedRoute>},
    {path:"/home", element: <AuthenticatedRoute><Layout><HomePage/></Layout></AuthenticatedRoute>},

    {path:"*", element: <Navigate to="/signin" replace />},
])

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme} >
                <AuthProvider>
                    <RouterProvider router={router}/>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
