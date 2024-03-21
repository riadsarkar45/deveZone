import { createBrowserRouter } from "react-router-dom";
import Home from "../Home"
import Login from "../Pages/Login";
import Root from "../Components/Root/Root";
import AddNewPost from "../Components/Posts/AddNewPost";
import Detail from "../Components/Posts/Detail";
import Registration from "../Pages/Registration";
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

