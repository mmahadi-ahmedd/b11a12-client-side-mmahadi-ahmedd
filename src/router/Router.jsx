
import { createBrowserRouter } from "react-router";
import { Home } from "../Pages/Home/Home/Home";
import RootLayout from "../Layout/RootLayout";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import PrivateRoutes from "../Routes/PrivateRoutes";
import BeCharity from "../Pages/BeCharity/BeCharity";


export const router = createBrowserRouter([
  {
    path: "/",
    element:<RootLayout></RootLayout>,
    children:[
        {
            index:true,
            Component:Home
        },
        {
          path:'/beCharity',
          element:<PrivateRoutes>
            <BeCharity></BeCharity>
          </PrivateRoutes>
        }
    ],
  },
  {
    path:"/",
    Component:AuthLayout,
    children:[
      {
        path:'login',
        Component:Login
      },
      {
        path:'register',
        Component:Register
      }
    ]
  },
]);