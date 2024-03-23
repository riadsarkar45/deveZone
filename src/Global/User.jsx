import { createContext, useContext, useEffect, useState } from "react";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { AuthContext } from "../Auth/AuthProvider/AuthProvider";

export const UserContext = createContext(null);

const User = ({ children }) => {
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({}); // Initialize as null

    useEffect(() => {
        if (!user) return; // Early return if user is not available
        axiosPublic.get(`/loggedIn-user/${user?.uid}`)
            .then((res) => {
                console.log(res.data);
                setUserInfo(res.data);
            })

    }, [axiosPublic, user]);
    const users = { userInfo }
    return (
        <UserContext.Provider value={users}>
            {children}
        </UserContext.Provider>
    );
};

export default User;
