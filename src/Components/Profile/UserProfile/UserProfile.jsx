import { FaEllipsisH } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Auth/AuthProvider/AuthProvider";
import { MarkEmailRead } from "@mui/icons-material";
import SelectedCategory from "./SelectedCategory";
import Posts from "./Posts";
import Following from "./Following";
const UserProfile = () => {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const[following, setFollowing] = useState([])
    const axiosPublic = useAxiosPublic();
    const { userId } = useParams()
    const { user } = useContext(AuthContext)
    const { refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            if (!user) return null
            const res = await axiosPublic.get(`/userprofile/${userId}`);
            setFollowing(res.data.getFollowedUsers);
            setPosts(res.data.findPost);
            setUsers(res.data.user);
            return res.data;
        },
        enabled: !!user
    });
    const isFollowing = users.followers && users.followers?.includes(user?.uid);

    

    return (
        <div className="flex gap-3 w-[90%] m-auto">
            <div className='shadow-sm w-full'>
                <img className="opacity-25 h-[20rem] w-full" src="https://i.ibb.co/v4w18Pk/Brave-Browser.jpg" alt="" />
                <div className="flex justify-between items-center mt-10 text-xl mb-4">
                    <h2>{users?.name}</h2>
                    <FaEllipsisH />
                </div>

                <div className="">
                    <ul className="list-none flex gap-2 p-2 mb-6 border-b border-gray-300">
                        {
                            users?.selectedTopics?.map((topics, i) => <SelectedCategory key={i} topics={topics} />)
                        }
                    </ul>
                </div>

                {
                    posts?.map((post, i) => <Posts key={i} post={post}></Posts>)
                }
            </div>

            <div className='shadow-md w-[50%] p-2'>
                <img className="h-[8rem] w-[8rem] rounded-[8rem]" src={users?.image} alt="" />
                <div>
                    <h2 className="text-xl mb-1">{users?.name}</h2>
                    <h2 className="mb-4 text-sm">{users?.following?.length} Following | {users?.followers?.length} Followers</h2>
                    <div className="flex gap-4">
                        <button className="btn btn-sm btn-outline btn-success">{isFollowing ? 'Following': 'Follow'}</button>
                        <button className="btn btn-sm btn-outline btn-success"><MarkEmailRead /></button>
                    </div>
                    <div>
                        <h2 className="font-bold mt-4 mb-3">Following</h2>
                        {
                            following?.map((users, i) => <Following key={i} users={users}/>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;