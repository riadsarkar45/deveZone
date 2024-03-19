import { useContext } from "react";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";

const User = ({ users, handleFollowUser }) => {
    const { user } = useContext(AuthContext)
    const { name, followersCount, _id, followers, uid } = users;
    const filt = followers?.includes(user?.uid);
    

    return (
        <div>
            <div className="flex gap-2 items-center justify-between mt-3">
                <div className="flex gap-3 items-center">
                    <div>
                        <img className="w-[3rem] h-[3rem] rounded-[3rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                    </div>
                    <div>
                        <h2>{name}</h2>
                        <p>{followersCount} followers</p>
                    </div>
                </div>
                <div>
                    {
                        filt ? (
                            <button className="btn border-teal-300 p-2 btn-sm">Following</button>
                        ) : (
                            <button onClick={() => handleFollowUser(user?.uid, _id, uid)} className="btn border-teal-300 p-2 btn-sm">Follow</button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default User;