import { useContext, useState } from "react";
import Categories from "./Categories";
import Post from "./Components/Posts/Post";
import RightSidebar from "./Components/RightSidebar/RightSidebar";
import useAxiosPublic from "./Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./Auth/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
const categories = [
    {
        "cateName": 'For You'
    },
    {
        "cateName": 'Following'
    },
    {
        "cateName": 'Technology'
    },
    {
        "cateName": 'Programming'
    }
]
const Home = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState('For You')
    const [posts, setPosts] = useState([])
    const [isSaved, setIsSaved] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const { refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/get/post/with/category/${selectedCategory}`);
            setPosts(res.data);
            setIsLoading(false)
            return res.data;
        },
    });


    const handleSavePost = (postId) => {
        setIsSaved(true)
        if (isSaved) {
            toast.loading('Saving...')
        }
        const dataToSave = { userId: user?.uid, postId: postId }
        axiosPublic.post('/save-post', dataToSave)
            .then((res) => {
                refetch()
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
        setIsLoading(true)
        setSelectedCategory(cat)
        axiosPublic.get(`/get/post/with/category/${cat}/${user?.uid}`)
            .then(res =>
                setPosts(res.data),
                setIsLoading(false)
            )
    }
    return (
        <div>

            <div className="flex justify-between w-[90%] m-auto">

                <div className="bg-gradient-to-r  min-h-screen w-[75%] p-2 border-r-2">
                    <div className="flex gap-3 p-3 border-b border-gray-300">
                        {
                            categories?.map((cat, i) =>
                                <Categories key={i}
                                    cat={cat}
                                    gePosts={gePosts}
                                    selectedCategory={selectedCategory}
                                />
                            )
                        }
                    </div>
                    {

                        isLoading ? (
                            <div className="flex items-center justify-center h-screen" >
                                <div className="flex space-x-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-bounce"></div>
                                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-bounce"></div>
                                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        ) : posts?.map((post, i) => <Post
                            key={i}
                            post={post}
                            handleSavePost={handleSavePost}
                        />)

                    }
                </div>


                <div className="hidden md:block w-[24rem]  h-full overflow-y-auto overscroll-none">
                    <RightSidebar />
                </div>
            </div>
        </div >
    );
};

export default Home;