import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useContext, useState } from "react";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";
import SavedPost from "./SavedPost";
import IsLoading from "../../Hooks/IsLoading";
import Users from "../Users/Users";
const RightSidebar = () => {
    const axiosPublic = useAxiosPublic();
    const [savedPost, setSavedPost] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useContext(AuthContext)
    
    return (
        <div>
            <div className="text-sm flex gap-3 p-2">
                <div className="">
                    <h2>Who to follow</h2>

                    <div>
                        <Users></Users>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;