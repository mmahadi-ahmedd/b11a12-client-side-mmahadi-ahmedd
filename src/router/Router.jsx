
import { createBrowserRouter } from "react-router";
import { Home } from "../Pages/Home/Home/Home";
import RootLayout from "../Layout/RootLayout";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import PrivateRoutes from "../Routes/PrivateRoutes";
import BeCharity from "../Pages/BeCharity/BeCharity";
import DashBoardLayout from "../Layout/DashBoardLayout";
import CharityProfile from "../Pages/Dashboard/CharityProfile/CharityProfile";
import CharityRequests from "../Pages/Dashboard/CharityRequests/CharityRequests";
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import RestaurantProfile from "../Pages/Dashboard/RestaurentProfile/RestaurentProfile";
import AddDonations from "../Pages/Dashboard/AddDonations/AddDonations";
import MyDonations from "../Pages/Dashboard/MyDonations/MyDonations";
import ManageDonations from "../Pages/Dashboard/ManageDonations/ManageDonations";
import FeatureDonations from "../Pages/Dashboard/FeatureDonations/FeatureDonations";
import Payment from "../Pages/Dashboard/Payment/Payment";
import TransactionHistory from "../Pages/Dashboard/TransactionHistory/TransactionHistory";
import AllDonations from "../Pages/AllDonations/AllDonations";
import DonationsDetails from "../Pages/DonationDetails/DonationsDetails";
import RequestedDonations from "../Pages/Dashboard/RequestedDonations/RequestedDonations";


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
        },
        {
          path:'/allDonations',
          element:<PrivateRoutes>
            <AllDonations></AllDonations>
          </PrivateRoutes>
        },
        {
          path:'/donations/:id',
          element:<PrivateRoutes>
            <DonationsDetails></DonationsDetails>
          </PrivateRoutes>
        },
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
  {
    path:'/dashboard',
    element:
    <PrivateRoutes>
      <DashBoardLayout></DashBoardLayout>
    </PrivateRoutes>,
    children:[
      {
        path:'payment/:reqId',
        Component: Payment 
      },
      {
        path:'transaction/reqId',
        Component:TransactionHistory
      },
      {
        path:'manageusers',
        Component:ManageUsers
      },
      {
        path:'adminProfile',
        Component:AdminProfile
      },
      {
        path:'restaurentProfile',
        Component:RestaurantProfile
      },
      {
        path:'addDonation',
        Component:AddDonations
      },
      {
        path:'myDonation',
        Component:MyDonations
      },
      {
        path:'requestedDonations',
        Component:RequestedDonations
      },
      {
        path:'manageDonations',
        Component:ManageDonations
      },
      {
        path:'featureDonations',
        Component:FeatureDonations
      },
      {
        path:'charityProfile',
        Component:CharityProfile
      },
      {
        path: 'charityRequests',
        Component:CharityRequests 
      }
    ]
    
  }
]);