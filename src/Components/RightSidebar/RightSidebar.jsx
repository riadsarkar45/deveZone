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
    const { refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            if (!user) return null
            const res = await axiosPublic.get(`/saved-post/${user?.uid}`);
            setSavedPost(res.data);
            setIsLoading(false)
            return res.data;
        },
        enabled: !!user,
    });
    return (
        <div>
            <div className="text-sm flex gap-3 p-2">
                <div className="">
                    <h2>Recently Saved</h2>
                    <div className="text-xl">
                        {
                            isLoading ? (
                                <IsLoading />
                            ) : savedPost?.map((posts, i) => <SavedPost key={i} posts={posts}></SavedPost>)
                        }
                    </div>

                    <div>
                        <Users></Users>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;