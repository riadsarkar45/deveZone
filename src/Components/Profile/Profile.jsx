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
    const [isCreatePoll, setIsCreatePoll] = useState(false)
    const [isEditing, setIsEditing] = useState('')
    const [totalInput, setTotalInput] = useState([])
    const [opt, setOptions] = useState()
    const [pollTitle, setPollTitle] = useState('')

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



    const handleEdit = (id) => {
        setIsEditing(id)
    }

    useEffect(() => {
        if (clickedMenu === 'Library') {
            setLibrary(true)
        }
    }, [clickedMenu])

    const handlePolls = () => {
        setIsCreatePoll(bool => !bool)
    }

    const handleAddOptions = () => {
        const words = opt.split(',').map(word => word.trim());
        setTotalInput(words);
    }

    const handleGetOptions = (text) => {
        setOptions(text)
    }

    const handleGetPollTitle = (title) => {
        setPollTitle(title)
    }

    const handleSubmitPoll = () => {
        const dataToInsert = { pollTitle, uid:userInfo?.uid, options: totalInput.map(text => ({ text: text })) }
        axiosPublic.post(`/create-poll`, dataToInsert).then(() => refetch(), setIsCreatePoll(false))
    }


    return (
        <div className="w-[90%] m-auto mt-10">
            {
                isCreatePoll ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div data-popover="popover" className="relative p-4 bg-gray-100 rounded-lg shadow-lg w-[52rem] max-h-screen overflow-y-auto text-blue-gray-500">
                            <button
                                onClick={handlePolls}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="mt-3">
                                <h2 className="border-b p-2 border-gray-300 text-2xl">Create Polls</h2>
                                <input onChange={e => handleGetPollTitle(e.target.value)} className="w-full border border-gray-200 p-2 mt-4 rounded-md" placeholder="Enter Poll Title" type="text" />
                            </div>
                            <div className="mt-3 flex items-center">

                                <input onChange={e => handleGetOptions(e.target.value)} className="w-full border border-r-0 border-gray-200 p-3  rounded-l-md" placeholder="Use comma for multiple options" type="text" />
                                <button onClick={handleAddOptions} className="p-2 border border-gray-300 bg-gray-200 hover:bg-green-500 font-bold text-xl w-[4rem] rounded-r-md">+</button>
                            </div>
                            <div className="mt-4">
                                <button onClick={handleSubmitPoll} className="btn btn-sm btn-outline">Submit</button>
                            </div>
                            <div className="mt-3 items-center">

                                {
                                    totalInput?.map((opt, i) =>
                                        <div key={i}>
                                            <h2 className="bg-blue-300 rounded-md border border-blue-500 p-2 mt-2 bg-opacity-20">{opt}</h2>
                                        </div>

                                    )
                                }

                            </div>
                        </div>
                    </div>

                ) : null
            }
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

                                </div>
                            ) : myPost ? (
                                <div className="overflow-x-auto max-w-[50rem]">
                                    <table className="table table-zebra">
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Desc</th>

                                                <th>Likes</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                allPosts?.map((posts, i) =>
                                                    <AllPost
                                                        key={i}
                                                        i={i}
                                                        posts={posts}
                                                        nonFollowersLikes={nonFollowersLikes}
                                                        followersLiked={followersLiked}
                                                        handleEdit={handleEdit}
                                                        isEditing={isEditing}
                                                    />
                                                )
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
                            <h2>{userInfo?.followersCount} <span className="cursor-pointer" onClick={() => handleClickMenu('Followers')}>Follower</span>
                                || {userInfo?.following?.length}
                                <span className="cursor-pointer" onClick={() => handleClickMenu('Following')}>Following</span></h2>
                            <h2 onClick={() => handleClickMenu('Edit Profile')} className="text-green-500 cursor-pointer mt-6">Edit Profile</h2>
                            <h2 onClick={() => handlePolls()} className="text-green-500 cursor-pointer mt-6">Create Poll</h2>
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