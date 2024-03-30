import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../../Global/User";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
const EditProfile = () => {
    const { userInfo } = useContext(UserContext)
    const [imageUrl, setImageUrl] = useState('');
    const [userName, setUserName] = useState(userInfo?.name)
    const [userEmail, setUserEmail] = useState(userInfo?.email)
    const [height, setHeight] = useState('10')
    const [opacity, setOpacity] = useState('0.97')
    const [isLoading, setIsLoading] = useState(null)
    const axiosPublic = useAxiosPublic()


    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const form = e.target;
        const formData = new FormData(form);
        formData.get('image')
        try {
            const res = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const imgUrl = res.data.data.display_url;
            const dataToSend = { userName, userEmail, imgUrl, height, opacity }
            axiosPublic.put(`update-user-profile/${userInfo?.uid}`, dataToSend)
                .then(() => setIsLoading(false))

        } catch (error) {
            console.error(error)
        }
    }

    

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const setCoverPhotoHeight = (height) => {
        setHeight(height + 'rem');
    }
    const setCoverPhotoOpacity = (opacity) => {
        setOpacity(opacity)
    }
    const handleUserName = (userName) => {
        setUserName(userName)
    }
    const handleUserEmail = (userEmail) => {
        setUserEmail(userEmail)
    }
    return (
        <div>
            <form onSubmit={handleUpdateProfile}>
                <div className="p-2">
                    <div>
                        <TextField onChange={e => handleUserName(e.target.value)} value={userName} id="standard-basic" label="Name" variant="standard" fullWidth />
                    </div>
                    <div className="mt-3">
                        <TextField onChange={e => handleUserEmail(e.target.value)} value={userEmail} id="standard-basic" label="Email" variant="standard" fullWidth />
                    </div>
                    <div className="mt-3">
                        <h2 className="text-sm mb-1">Cover Photo</h2>
                        <input name="image" onChange={handleImageUpload} type="file" className="file-input file-input-bordered w-full " />
                        {
                            imageUrl ? (
                                <div className="border border-gray-300 gap-2 flex items-center mt-6 shadow-sm p-1">
                                    <input onChange={e => setCoverPhotoHeight(e.target.value)} defaultValue={height} type="number" placeholder="Set Height" className="input input-bordered w-full" />
                                    <input onChange={e => setCoverPhotoOpacity(e.target.value)} step='0.01' type="number" placeholder="Set Opacity" className=" input input-bordered w-full" />
                                </div>
                            ) : null
                        }

                        <div className="">
                            {imageUrl && <img style={{ height: height, opacity: opacity }} className={`mt-6 w-full`} src={imageUrl} alt="Uploaded" />}

                        </div>
                    </div>
                    <div className="mt-3">
                        {
                            isLoading ? (
                                <button className="btn "><span className="loading loading-ball loading-lg"></span> </button>
                            ) : <button className="btn-md btn btn-success btn-outline">Save </button>

                        }

                    </div>
                </div>
            </form>
        </div>

    );
};

export default EditProfile;