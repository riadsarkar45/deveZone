import { useContext, useEffect, useState } from "react";
import Categories from "./Categories";
import Post from "./Components/Posts/Post";
import useAxiosPublic from "./Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./Auth/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import Users from "./Components/Users/Users";
import { CiCirclePlus } from "react-icons/ci";
import IsLoading from "./Hooks/IsLoading";
import AllTopics from "./Pages/AllTopics";

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState('For You')
    const [posts, setPosts] = useState([])
    const [isSaved, setIsSaved] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [categories, setCategories] = useState([])



    useEffect(() => {
        if (!user) return;

        setIsLoading(true);

        axiosPublic.get(`/get/post/default/${'For You'}/${user.uid}`)
            .then((res) => {
                setPosts(res.data);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });

        axiosPublic.get(`/categories/${user.uid}`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [axiosPublic, user?.uid, user]);

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
                <div className="modal-box w-11/12 max-w-5xl m-auto min-h-screen">
                    <div className="modal-action">
                        <AllTopics />
                        <form method="dialog">
                            {/* if there is a button, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div >
    );
};

export default Home;