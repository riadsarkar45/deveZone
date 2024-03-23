import { useContext, useState } from "react";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Topics from "./Topics";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../Auth/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

const AllTopics = () => {
    const { user } = useContext(AuthContext)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [suggestions] = useState([])
    const axiosPublic = useAxiosPublic()
    const navigate = useNavigate()
    const { refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await axiosPublic.get(`/all-topics`);
                setCategories(res.data)
                return res.data;
            } catch (error) {
                console.error("Error fetching posts:", error);
                return null;
            }
        },
    })

    const toggleTagSelection = (tag) => {
        if (selectedCategory.includes(tag)) {
            setSelectedCategory(selectedCategory.filter(selectedTag => selectedTag !== tag));
        } else {
            setSelectedCategory([...selectedCategory, tag]);
        }
    }

    const handleSetTopic = () => {
        axiosPublic.put(`/update-user-topic/${user?.uid}`, selectedCategory)
            .then(() => { refetch(), navigate('/') })
    }
    return (

        <div className=" bg-gray-500 bg-opacity-20 shadow-md p-2 rounded-md w-[50rem] m-auto">
            <h2 className="text-xl">Select Topics</h2>
            <div>
                {
                    selectedCategory.length > 0 ? (
                        <div className='bg-yellow-500 bg-opacity-30 p-2 mt-4 rounded-md border border-yellow-400 shadow-lg mb-2 text-red-800'>
                            <h2>We will suggest posts according to your interest</h2>
                            <p>Note: You can update it any time</p>
                        </div>
                    ) : null
                }
                <div className="grid grid-cols-4 p-2 gap-2">

                    {
                        categories?.map((cat, i) => <Topics
                            key={i}
                            cat={cat}
                            toggleTagSelection={toggleTagSelection}
                            selectedCategory={selectedCategory}
                            suggestions={suggestions}
                        />
                        )
                    }

                </div>
                <div className='flex justify-end  m-auto items-end border-0'>
                    <button onClick={() => handleSetTopic()} className='btn bg-teal-500 bg-opacity-50 p-2 text-2xl text-white rounded-md border-gray-200 border shadow-md'>Get Started</button>
                </div>
            </div>
        </div>

    );
};

export default AllTopics;