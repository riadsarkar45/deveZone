import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthProvider/AuthProvider';
import useAxiosPublic from '../../Hooks/BaseUrl/useAxiosPublic';

const Registration = () => {
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
    const { logOut, updateUser, createUser } = useContext(AuthContext)
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.get('image')
        const email = form.email.value;
        console.log(email);
        const name = form.name.value;
        const password = form.password.value;
        const role = "user";
        const status = "active"


        try {
            const res = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const imgUrl = res.data.data.display_url;
            const all = { name, email, role, status, image: res.data.data.display_url }
            if (res.data.success) {
                createUser(email, password)
                    .then(res => {

                        axiosPublic.post('/api/insert/users', all)
                        .then(() => {
                            updateUser(name, imgUrl)
                            .then(() => { })
                            .catch(error => console.error(error))
                        })


                        logOut()
                            .then(() => {
                                navigate("/login")
                            })
                            .catch(error => console.error(error))

                        form.reset();
                        console.log(res.user)
                    })
                    .catch(error => console.error(toast.error(error.message)))
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <div>
            <div className="flex items-center justify-center h-[100vh] font-serif bg-white bg-opacity-20 text-white">
                <form onSubmit={handleCreateUser}>
                    <div className="grid grid-cols-1 bg-white bg-opacity-20 shadow-md p-2 rounded-md">
                        <div>
                            <h2>User Name</h2>
                            <input name='name' className="bg-white text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" type="text" />
                        </div>
                        <div>
                            <h2>Profile Photo</h2>
                            <input name='image' className="bg-white text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" type="file" />
                        </div>
                        <div>
                            <h2>Email</h2>
                            <input name='email' type="email" className="bg-white text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" />
                        </div>
                        <div>
                            <h2>Password</h2>
                            <input name='password' className="bg-white text-black p-3 mt-2 lg:w-[30rem] w-full rounded-md" type="text" />
                        </div>
                        <div className="text-center mt-7 ">
                            <button className="bg-green-500 shadow-[red] lg:w-[13rem] w-full bg-opacity-20 border border-green-500 rounded-md p-2">Register</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Registration;