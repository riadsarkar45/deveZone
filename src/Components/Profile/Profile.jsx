import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { FaGitter } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaWeibo } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";
import SavedPost from "./SavedPost";
import Menu from "./Menu";
import ReactApexChart from 'react-apexcharts';
import AllPost from "./AllPost";
import { UserContext } from "../../Global/User";
import Following from "./Following";
import EditProfile from "./EditProfile";
import ProfileVisitChart from "./ProfileVisitChart";
const profileMenu = [
    {
        name: 'Library',
        icon: <FaWeibo />
    },
    {
        name: 'Stories',
        icon: <FaBookOpen />
    },
    {
        name: 'Stats',
        icon: <FaGitter />
    },
    {
        name: 'My Posts',
        icon: <FaGitter />
    },
]
const Profile = () => {
    const [savedPost, setSavedPost] = useState([])
    const [allPosts, setAllPost] = useState([])
    const { user } = useContext(AuthContext)
    const { userInfo } = useContext(UserContext)
    const axiosPublic = useAxiosPublic()
    const [clickedMenu, setClickedMenu] = useState('Library')
    const [showLibrary, setLibrary] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [myPost, setMyPost] = useState(false)
    const [following, setFollowing] = useState([])
    const [showFollowing, setIShowFollowing] = useState(false)
    const [showFollowers, setShowFollowers] = useState(false)
    const [followers, setFollowers] = useState(false)
    const [followersLiked, setFollowersLiked] = useState([])
    const [nonFollowersLikes, setNonFollowersLikes] = useState({})
    const [isEditProfile, setIsEditProfile] = useState(false)
    const { refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                if (!user) return null
                const res = await axiosPublic.get(`/saved-post/${user?.uid}`)
                const allPosts = await axiosPublic.get(`/individual-posts/${user?.uid}`)
                setNonFollowersLikes(allPosts.data.nonFollowers);
                setFollowersLiked(allPosts.data.likedUsers);
                setAllPost(allPosts.data.query)
                setSavedPost(res.data)
                return { savedPost: res.data, allPosts: allPosts.data };
            } catch (error) {
                console.error("Error fetching posts:", error);
                return null;
            }
        },
        enabled: !!user
    })

    const handleClickMenu = (clickedMenu) => {
        if (clickedMenu === 'Library') {
            setLibrary(true)
        } else if (clickedMenu === 'Stats') {
            setLibrary(false)
            setShowStats(true)
        } else if (clickedMenu === 'My Posts') {
            setMyPost(true)
            setLibrary(false)
            setShowStats(false)
        } else if (clickedMenu === 'Following') {
            axiosPublic.get(`/follower/following/${user?.uid}`)
                .then((res) => {
                    setFollowing(res.data)
                    setIShowFollowing(true)
                    setLibrary(false)
                    setShowFollowers(false)
                    setMyPost(false)
                    setShowStats(false)
                })

        } else if (clickedMenu === 'Followers') {
            axiosPublic.get(`/follower/${user?.uid}`)
                .then((res) => {
                    setShowFollowers(true)
                    setFollowers(res.data)
                    setIShowFollowing(false)
                    setLibrary(false)
                    setMyPost(false)
                    setShowStats(false)
                })
        } else if (clickedMenu === 'Edit Profile') {
            setShowFollowers(false)
            setIShowFollowing(false)
            setLibrary(false)
            setMyPost(false)
            setShowStats(false)
            setIsEditProfile(true)
        }
        setClickedMenu(clickedMenu)
    }
    const likes = allPosts?.map(likes => likes.likes)
    const comments = allPosts?.map(likes => likes.totalComment)
    const clicks = allPosts?.map(clicks => clicks.clicks)

    const series = [
        {
            name: 'Likes',
            data: likes
        },
        {
            name: 'Comments',
            data: comments
        },
        {
            name: 'Clicks',
            data: clicks
        }
    ];

    const options = {
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Posts Analytics',
            align: 'left'
        },

    };

    useEffect(() => {
        if (clickedMenu === 'Library') {
            setLibrary(true)
        }
    }, [clickedMenu])

    return (
        <div className="w-[90%] m-auto mt-10">
            <div className="flex gap-3 ">
                <div className="flex-1 gap-4 items-center bg-gray-50 shadow-sm">
                    <div>
                        {
                            showLibrary ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Likes</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                savedPost?.map((posts, i) => <SavedPost key={i} i={i} posts={posts} />)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            ) : showStats ? (
                                <div className="">
                                    <div className="mb-10">
                                        <div className="rounded-md" id="chart">
                                            <ReactApexChart options={options} series={series} type="area" height={350} />
                                        </div>
                                        <div id="html-dist"></div>
                                    </div>

                                    <div className="mt-3">

                                        <ProfileVisitChart />
                                    </div>
                                </div>
                            ) : myPost ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Likes</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                allPosts?.map((posts, i) => <AllPost key={i} i={i} posts={posts} nonFollowersLikes={nonFollowersLikes} followersLiked={followersLiked} />)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            ) : showFollowing ? (
                                <div className="p-3">

                                    {
                                        following?.map((follows, i) => <Following key={i} follows={follows} />)
                                    }
                                </div>
                            ) : showFollowers ? (
                                <div className="p-3">

                                    {
                                        followers?.map((follows, i) => <Following key={i} follows={follows} />)
                                    }
                                </div>
                            ) : isEditProfile ? (
                                <EditProfile />
                            ) : null
                        }


                    </div>
                </div>
                <div className="w-[20rem] ml-10 h-[11rem] shadow-sm">
                    <div className=" shadow-sm">
                        <div className="h-[6rem] w-[6rem] rounded-[6rem] flex">
                            <img className="h-[5rem] w-[5rem] rounded-[6rem] m-auto" src={userInfo?.image} alt="" />
                        </div>
                        <div className="p-3">
                            <h2 className="font-bold mb-3">{userInfo?.name}</h2>
                            <h2>{userInfo?.followersCount} <span className="cursor-pointer" onClick={() => handleClickMenu('Followers')}>Follower</span>  || {userInfo?.following?.length} <span className="cursor-pointer" onClick={() => handleClickMenu('Following')}>Following</span></h2>
                            <h2 onClick={() => handleClickMenu('Edit Profile')} className="text-green-500 cursor-pointer mt-6">Edit Profile</h2>
                            <div>
                                <ul className="list-none mt-2 text-xl">
                                    {
                                        profileMenu?.map((menu, i) =>
                                            <Menu
                                                key={i}
                                                menu={menu}
                                                handleClickMenu={handleClickMenu}
                                                clickedMenu={clickedMenu}
                                            />
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Profile;