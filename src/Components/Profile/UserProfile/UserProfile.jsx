import { FaEllipsisH } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Auth/AuthProvider/AuthProvider";
import { MarkEmailRead } from "@mui/icons-material";
import SelectedCategory from "./SelectedCategory";
import Posts from "./Posts";
import Followers from "../Followers";
const UserProfile = () => {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [followers, setFollowers] = useState([])
    const axiosPublic = useAxiosPublic();
    const { userId } = useParams()
    const { user } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isShowFollowers, setShowFollowers] = useState(false)
    const { refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            if (!user) return null
            const res = await axiosPublic.get(`/userprofile/${userId}`)
            setFollowers(res.data.getFollowers)
            setPosts(res.data.findPost);
            setUsers(res.data.user);
            setIsLoading(false)
            return res.data;
        },
        enabled: !!user
    });
    const isFollowing = users.followers && users.followers?.includes(user?.uid);
    useEffect(() => {
        refetch();
    }, [refetch])

   

    const showFollowers = () => {
        setShowFollowers(prevState => !prevState);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center text-center justify-center">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        )
    }

    return (
        <div>
            {
                isShowFollowers ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div data-popover="popover" className="relative p-4 bg-gray-100 rounded-lg shadow-lg w-[52rem] max-h-screen overflow-y-auto text-blue-gray-500">
                            <button
                                onClick={showFollowers}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="mt-3">
                                <h2 className="border-b p-2 border-gray-300 text-2xl">Followers</h2>
                                {
                                    followers?.length <= 0 ? (
                                        <div>
                                            <h2 className="text-center mt-10 text-2xl">No followers</h2>
                                        </div>
                                    ) : (
                                        followers?.map((user, i) => <Followers user={user} key={i} />)
                                    )
                                }
                            </div>
                        </div>
                    </div>

                ) : null
            }



            <div className="flex gap-3 w-[90%] m-auto">
                <div className='shadow-sm w-full'>
                    <img className={`"opacity-${users?.opacity} h-${users?.height} w-full"`} src={users?.cover} alt="" />
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
                        posts?.map((post, i) => <Posts key={i} post={post} isShowFollowers={isShowFollowers}></Posts>)
                    }
                </div>

                <div className='shadow-md w-[50%] p-2'>
                    <img className="h-[8rem] w-[8rem] rounded-[8rem]" src={users?.image} alt="" />
                    <div>
                        <h2 onClick={() => showFollowers()} className="text-xl mb-1">{users?.name}</h2>
                        <h2 className="mb-4 text-sm">{users?.following?.length} Following | {users?.followers?.length} <span onClick={showFollowers} className="cursor-pointer">Followers</span></h2>
                        <div className="flex gap-4">
                            <button className="btn btn-sm btn-outline btn-success">{isFollowing ? 'Following' : 'Follow'}</button>
                            <button className="btn btn-sm btn-outline btn-success"><MarkEmailRead /></button>
                        </div>
                        {/* <div className="border-b p-2 border-gray-200">
                            <h2 className="font-bold mt-4 mb-3">Following</h2>
                            {
                                following.length <= 0 ? (
                                    <h2>{users?.name} Is not following someone</h2>
                                ) : following?.map((users, i) => <Following key={i} users={users} handleSeeOtherProfile={handleSeeOtherProfile} />)
                            }
                        </div>
                        <div>
                            <h2 className="font-bold mt-4 mb-3 p-2">Followers</h2>
                            {
                                followers.length <= 0 ? (
                                    <h2>{users?.name} has no follower be the first follower</h2>
                                ) : followers?.map((users, i) => <Following key={i} users={users} handleSeeOtherProfile={handleSeeOtherProfile} />)
                            }
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;