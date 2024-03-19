import { Editor } from "@tinymce/tinymce-react";
import { FaPlus } from "react-icons/fa";

const Profile = () => {
    return (
        <div>
            <div className="h-[25rem] ">
                <div className=" w-[17rem]">
                    <img className="rounded-t-[3rem]" src="https://i.ibb.co/t22VxW0/wallpaperflare-com-wallpaper-2.jpg" alt="" />
                    <div className="flex justify-center relative items-center mt-[-3rem]">
                        <img className="w-[30%] rounded-[30%]  shadow-lg" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                    </div>
                </div>
                <div className="text-center mt-5">
                    <h2>Riad Sarkar</h2>
                    <p>Frontend Developer</p>
                </div>
                <div className="mt-3">
                    <div className="border-2 w-[16rem] m-auto"></div>
                    <div className="flex text-center justify-center items-center gap-3 p-3 w-full m-auto">
                        <div className="">
                            <h2>33</h2>
                            <p>Followers</p>
                        </div>
                        <div className="">
                            <h2>33</h2>
                            <p>Following</p>
                        </div>
                    </div>
                    <div className="border-2 w-[16rem] m-auto"></div>
                </div>

                <div className="w-full h-14 mb-7 p-2 ">
                    <div>
                        <button onClick={() => document.getElementById('my_modal_1').showModal()} className="bg-gray-500 btn p-2 text-2xl rounded-md bg-opacity-25 w-full"><FaPlus /> Write</button>
                    </div>
                </div>
            </div>
            <dialog id="my_modal_1" className="modal">
    <div className="modal-box w-11/12 max-w-5xl m-auto flex justify-center ">
        <div className="modal-action text-center">
            <form method="dialog w-full">
                <Editor />
                <button className="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>



        </div>
    );
};

export default Profile;