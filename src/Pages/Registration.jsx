import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { AuthContext } from '../Auth/AuthProvider/AuthProvider';
import Topics from './Topics';
import { useQuery } from '@tanstack/react-query';

const Registration = () => {
    const { user } = useContext(AuthContext)
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
    const { updateUser, createUser } = useContext(AuthContext)
    const axiosPublic = useAxiosPublic();
    const [steps, setSteps] = useState(1)
    const [percentage, setPercentage] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [suggestions] = useState([])

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
    });


    const handleCreateUser = async (e) => {
        setSteps(2)
        // e.preventDefault();
        // const form = e.target;
        // const formData = new FormData(form);
        // formData.get('image')
        // const email = form.email.value;
        // const name = form.name.value;
        // const password = form.password.value;
        // setPercentage(50)
        // try {
        //     const res = await axiosPublic.post(image_hosting_api, formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     })

        //     const imgUrl = res.data.data.display_url;

        //     if (res.data.success) {
        //         createUser(email, password)
        //             .then((res) => {
        //                 if (res.user) {
        //                     const userData = {
        //                         name,
        //                         email,
        //                         followersCount: 0,
        //                         followers: [],
        //                         uid: res.user.uid,
        //                         following: [],
        //                         selectedTopics: ['For You', 'Following'],
        //                         image: imgUrl
        //                     };

        //                     axiosPublic.post('/users', userData)
        //                         .then(() => {
        //                             updateUser(name, imgUrl)
        //                                 .then(() => {
        //                                     setSteps(2)
        //                                     form.reset()
        //                                 })
        //                                 .catch(error => console.error(error));
        //                         })
        //                         .catch(error => console.error("Error inserting user data:", error));
        //                 } else {
        //                     toast.error('Something went wrong. Try again later.')
        //                 }
        //             })
        //     }

        // } catch (error) {
        //     console.error(error)
        // }
    }

    const handleSetTopic = () => {
        axiosPublic.put(`/update-user-topic/${user?.uid}`, selectedCategory).then(res => console.log(res.data))
    }

    const toggleTagSelection = (tag) => {
        if (selectedCategory.includes(tag)) {
            setSelectedCategory(selectedCategory.filter(selectedTag => selectedTag !== tag));
        } else {
            setSelectedCategory([...selectedCategory, tag]);
        }
    };


    return (
        <div>
            <div className="flex items-center justify-center h-[100vh]  bg-opacity-20 ">

                {
                    steps === 1 ? (
                        <form onSubmit={handleCreateUser}>
                            <progress className="progress progress-accent w-full" value={percentage} max="100"></progress>

                            <div className="grid grid-cols-1 bg-gray-500 bg-opacity-20 shadow-md p-2 rounded-md">
                                <div>
                                    <h2>User Name</h2>
                                    <input name='name' className=" text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" type="text" />
                                </div>
                                <div>
                                    <h2>Profile Photo</h2>
                                    <input name='image' className=" text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" type="file" />
                                </div>
                                <div>
                                    <h2>Email</h2>
                                    <input name='email' type="email" className=" text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" />
                                </div>
                                <div>
                                    <h2>Password</h2>
                                    <input name='password' className=" text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" type="text" />
                                </div>
                                <div className="text-center mt-7 ">
                                    <button className="bg-green-500 shadow-[red] lg:w-[13rem] w-full bg-opacity-20 border border-green-500 rounded-md p-2">Register</button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className=" bg-gray-500 bg-opacity-20 shadow-md p-2 rounded-md w-[50rem]">
                            <h2 className="text-xl">Select Topics</h2>
                            <progress className="progress progress-accent w-full" value={percentage} max="100"></progress>
                            <div>
                                {
                                    selectedCategory.length > 0 ? (
                                        <div className='bg-yellow-500 bg-opacity-30 p-2 rounded-md border border-yellow-400 shadow-lg mb-6 text-red-800'>
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
                                <div className='flex justify-end  m-auto items-end'>
                                    <button onClick={() => handleSetTopic()} className='btn bg-teal-500 bg-opacity-50 p-2 text-2xl text-white rounded-md border-gray-200 border shadow-md'>Get Started</button>
                                </div>
                            </div>
                        </div>
                    )

                }

            </div>
        </div>
    );
};

export default Registration;