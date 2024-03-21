import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { AuthContext } from '../Auth/AuthProvider/AuthProvider';

const Registration = () => {
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
    const { updateUser, createUser } = useContext(AuthContext)
    const axiosPublic = useAxiosPublic();
    const [steps, setSteps] = useState(1)
    const [percentage, setPercentage] = useState(0)
    const handleCreateUser = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.get('image')
        const email = form.email.value;
        const name = form.name.value;
        const password = form.password.value;
        setPercentage(50)
        try {
            const res = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const imgUrl = res.data.data.display_url;

            if (res.data.success) {
                createUser(email, password)
                    .then((res) => {
                        if (res.user) {
                            const userData = {
                                name,
                                email,
                                followersCount: 0,
                                followers: [],
                                uid: res.user.uid,
                                following: [],
                                selectedTopics: ['For You', 'Following'],
                                image: imgUrl
                            };

                            axiosPublic.post('/users', userData)
                                .then(() => {
                                    updateUser(name, imgUrl)
                                        .then(() => {
                                            setSteps(2)
                                            form.reset()
                                        })
                                        .catch(error => console.error(error));
                                })
                                .catch(error => console.error("Error inserting user data:", error));
                        } else {
                            toast.error('Something went wrong. Try again later.')
                        }
                    })
            }

        } catch (error) {
            console.error(error)
        }
    }



    return (
        <div>
            <div className="flex items-center justify-center h-[100vh] font-serif  bg-opacity-20 ">

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
                        <div className="grid grid-cols-1 bg-gray-500 bg-opacity-20 shadow-md p-2 rounded-md">
                            <progress className="progress progress-accent w-full" value={percentage} max="100"></progress>
                            <div className="grid grid-cols-1 bg-gray-500 bg-opacity-20 shadow-md p-2 rounded-md">

                            </div>
                        </div>
                    )

                }

            </div>
        </div>
    );
};

export default Registration;