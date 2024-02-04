import {createBrowserRouter} from "react-router-dom";


import Base from "../pages/Base";
import Home from "../pages/Home";
import SignUp from "../modules/SignUp";
import Dashboard from "../Dashboard/Dashboard";
import SignIn from "../modules/SignIn";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Base></Base>,
        children:
            [
                {
                    path: '/',
                    element: <Home></Home>
                },
                {
                    path: '/signUp',
                    element: <SignUp></SignUp>
                },
                {
                    path: '/dashboard',
                    element: <Dashboard></Dashboard>,
                },
                {
                    path: '/signIn',
                    element: <SignIn></SignIn>
                },

                
            ]
        },
        
]);