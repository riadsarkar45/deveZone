import { createBrowserRouter } from "react-router-dom";
import Home from "../Home"
import Login from "../Pages/Login";
import Root from "../Components/Root/Root";
import AddNewPost from "../Components/Posts/AddNewPost";
import Detail from "../Components/Posts/Detail";
import Registration from "../Pages/Registration";
import Profile from "../Components/Profile/Profile";
import EditProfile from "../Components/Profile/EditProfile";
import UserProfile from "../Components/Profile/UserProfile/UserProfile";
export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            children: [
                {
                    path: '/:cat?',
                    element: <Home />
                },
                {
                    path: '/add-post',
                    element: <AddNewPost />
                },
                {
                    path: '/ddddd/:writer/:id/:uid',
                    element: <Detail/>
                },
                {
                    path: '/@/:userName?',
                    element: <Profile/>
                },
                {
                    path: '/edit',
                    element: <EditProfile/>
                },
                {
                    path: '/u/:userId',
                    element: <UserProfile/>
                }
            ]
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Registration/>
        }
    ]
)

