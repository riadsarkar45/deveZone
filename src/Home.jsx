import { useContext, useEffect, useState } from "react";
import Categories from "./Categories";
import Post from "./Components/Posts/Post";
import useAxiosPublic from "./Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./Auth/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import Users from "./Components/Users/Users";
import { CiCirclePlus } from "react-icons/ci";
import Suggestions from "./Suggestions";
import IsLoading from "./Hooks/IsLoading";

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState('For You')
    const [posts, setPosts] = useState([])
    const [isSaved, setIsSaved] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [suggestions] = useState([])
    const [selectedTags, setSelectedTags] = useState([]);
    const [defaultCat, setDefaultCat] = useState(null)
    const [categories, setCategories] = useState([])
    const { refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            if (!user) return null;
            try {
                const res = await axiosPublic.get(`/get/post/default/${defaultCat}/${user?.uid}`);
                const cat = await axiosPublic.get(`/categories/${user?.uid}`)
                setCategories(cat.data);
                if (selectedCategory !== 'For You') {
                    return null
                } else {
                    if (cat.data.length > 0) {
                        setDefaultCat(cat.data[0]);
                        console.log(cat.data[0]);
                    }
                }
                setPosts(res.data)
                setIsLoading(false);
                return res.data;
            } catch (error) {
                console.error("Error fetching posts:", error);
                return null;
            }
        },
        enabled: !!user
    });


    useEffect(() => {
        refetch();
    }, [refetch])

    const handleSavePost = (postId) => {
        setIsSaved(true)
        if (isSaved) {
            toast.loading('Saving...')
        }
        const dataToSave = { userId: user?.uid, postId: postId }
        axiosPublic.post('/save-post', dataToSave)
            .then((res) => {
                if (res.data.acknowledged) {
                    toast.success('Saved')
                    setIsSaved(false)
                } else {
                    toast.error(res.data.msg)
                    setIsSaved(false)

                }
            })
    }


    const gePosts = (cat) => {
        setSelectedCategory(cat)
        axiosPublic.post(`/get/post/with/category/${cat}/${user?.uid}`)
            .then(res =>
                setPosts(res.data),
                setIsLoading(false),
            )
    }


    const toggleTagSelection = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    const handleSetPostTopics = () => {
        axiosPublic.put(`/set-user-post-topics/${user?.uid}`, selectedTags).then(() => refetch())
    }


    return (
        <div>

            <div className="flex justify-between w-[90%] m-auto">

                <div className="bg-gradient-to-r  min-h-screen w-[75%] p-2 border-r-2">
                    <div className="flex gap-3 p-3 border-b border-gray-300 items-center">
                        <span className="text-2xl cursor-pointer" onClick={() => document.getElementById('my_modal_1').showModal()}><CiCirclePlus /></span>
                        {
                            isLoading ? (
                                <div className="flex gap-2">
                                    <div className="skeleton w-[9rem] h-[2rem]  shrink-0"></div>
                                    <div className="skeleton w-[9rem] h-[2rem]  shrink-0"></div>
                                    <div className="skeleton w-[9rem] h-[2rem]  shrink-0"></div>
                                    <div className="skeleton w-[9rem] h-[2rem]  shrink-0"></div>
                                </div>
                            ) : (
                                categories?.map((cats, i) =>
                                    <Categories key={i}
                                        cats={cats}
                                        gePosts={gePosts}
                                        selectedCategory={selectedCategory}
                                    />
                                )
                            )
                        }
                    </div>
                    {

                        isLoading ? (
                            <IsLoading />
                        ) : (
                            posts?.map((post, i) => <Post
                                key={i}
                                post={post}
                                handleSavePost={handleSavePost}
                            />
                            )
                        )

                    }
                </div>


                <div className="hidden md:block w-[24rem]  h-full overflow-y-auto overscroll-none">
                    <Users></Users>
                </div>
            </div>


            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <p className="py-4 text-2xl">Topics to follow </p>
                    <div className="grid grid-cols-3 gap-3">
                        {
                            categories?.map((cat, i) =>
                                <Suggestions
                                    key={i}
                                    cat={cat}
                                    suggestions={suggestions}
                                    toggleTagSelection={toggleTagSelection}
                                    selectedTags={selectedTags}
                                />
                            )
                        }
                    </div>
                    <div className="modal-action">
                        <form method="dialog">

                            <div className="flex gap-3">
                                <button className="btn btn-error text-white">Close</button>
                                <button onClick={() => handleSetPostTopics()} className="btn btn-success text-white">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </div >
    );
};

export default Home;