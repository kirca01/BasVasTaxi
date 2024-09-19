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
import {UserRoute} from "./security/UserRoute.tsx";
import {AdminRoute} from "./security/AdminRoute.tsx";
import {DriverRoute} from "./security/DriverRoute.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AllRidesPage from "./pages/AllRidesPage.tsx";
import OldRidesPage from "./pages/OldRidesPage.tsx";
import OldRidesDriverPage from "./pages/OldRidesDriverPage.tsx";
import VerifyUserPage from "./pages/VerifyUserPage.tsx";


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
    {path:"/profile", element: <AuthenticatedRoute><Layout><ProfilePage/></Layout></AuthenticatedRoute>},
    {path:"/history", element: <AuthenticatedRoute><UserRoute><Layout><OldRidesPage/></Layout></UserRoute></AuthenticatedRoute>},
    {path:"/verify", element: <AuthenticatedRoute><AdminRoute><Layout><VerifyUserPage/></Layout></AdminRoute></AuthenticatedRoute>},
    {path:"/allrides", element: <AuthenticatedRoute><AdminRoute><Layout><AllRidesPage/></Layout></AdminRoute></AuthenticatedRoute>},
    {path:"/newrides", element: <AuthenticatedRoute><DriverRoute><Layout><HomePage/></Layout></DriverRoute></AuthenticatedRoute>},
    {path:"/oldrides", element: <AuthenticatedRoute><DriverRoute><Layout><OldRidesDriverPage/></Layout></DriverRoute></AuthenticatedRoute>},

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
