import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../Layout/Dashboard";
import Profile from "../pages/Dashboard/Profile/Profile";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import ManageEvents from "../pages/Dashboard/ManageEvents/ManageEvents";
import PrivateRoute from "./PrivateRoute";
import AddEvent from "../pages/Dashboard/AddEvent/AddEvent";
import EventDetails from "../pages/EventDetails/EventDetails";
import UpdateEvent from "../pages/UpdateEvent/UpdateEvent";
import ManageVolunteers from "../pages/Dashboard/ManageVolunteers/ManageVolunteers";
import RegisteredEvents from "../pages/Dashboard/RegisteredEvents/RegisteredEvents";
import UserProfile from "../pages/Dashboard/UserProfile/UserProfile";
import Notifications from "../pages/Dashboard/Notifications/Notifications";
import AddReview from "../pages/Dashboard/AddReview/AddReview";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AdminRoute from "./AdminRoute";
import OrganizerRoute from "./OrganizerRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Reviews from "../pages/Dashboard/Reviews/Reviews";
export const router = createBrowserRouter([
    {
        path:'/',
        element: <MainLayout></MainLayout>,
        errorElement:<ErrorPage></ErrorPage>,
        children:[
            {
                path:'/',
                element: <Home></Home>
            },
            {
                path: '/events',
                element: <Events></Events>
            },
            {
                path: '/eventDetails/:eventId',
                element: <EventDetails></EventDetails>,
                loader:({params})=> fetch(`https://event-up-server.vercel.app/comments/count/${params.eventId}`)
            },
            {
                path: '/about',
                element: <About></About>
            },
            {
                path: '/contact',
                element: <Contact></Contact>
            },
            {
                path: '/register',
                element: <Register></Register>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
        ]
    },
    {
        path:'/dashboard',
        element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
        errorElement:<ErrorPage></ErrorPage>,
        children:[
            {
                path:'/dashboard/',
                element:<DashboardHome></DashboardHome>
            },
            {
                path:'allUsers',
                element:<AdminRoute><AllUsers></AllUsers></AdminRoute>
            },
            {
                path:'manageEvents',
                element:<OrganizerRoute><ManageEvents></ManageEvents></OrganizerRoute>
            },
            {
                path:'manageVolunteers/:eventId?',
                element:<OrganizerRoute><ManageVolunteers></ManageVolunteers></OrganizerRoute>
            },
            {
                path:'registeredEvents',
                element:<RegisteredEvents></RegisteredEvents>
            },
            {
                path:'addEvent',
                element:<OrganizerRoute><AddEvent></AddEvent></OrganizerRoute>
            },
            {
                path:'updateEvent/:eventId',
                element:<OrganizerRoute><UpdateEvent></UpdateEvent></OrganizerRoute>,
                loader:({params})=> fetch(`https://event-up-server.vercel.app/events/${params.eventId}`)
            },
            {
                path:'profile',
                element:<UserProfile></UserProfile>
            },
            {
                path: 'notifications',
                element: <Notifications></Notifications>
            },
            {
                path:'addReview/:eventId',
                element: <AddReview></AddReview>
            },
            {
                path:'reviews/:eventId',
                element:<OrganizerRoute><Reviews></Reviews></OrganizerRoute>
            }
        ]
    },
])