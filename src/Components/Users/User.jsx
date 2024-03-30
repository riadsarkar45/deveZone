import { useContext } from "react";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { FaEllipsisH, FaRegWindowMinimize } from "react-icons/fa";

const User = ({ users, handleFollowUser, handleSetProfileVisits, handleShowUserDetail, isShowPop, setIsShowPop }) => {
    const { user } = useContext(AuthContext)
    const { name, followersCount, _id, followers, image, uid } = users;
    const isFollowing = followers?.includes(user?.uid);


    return (
        <div>
            <div className="flex gap-2 items-center justify-between mt-3">
                <div className="flex gap-3 items-center">
                    <div>
                        <img className="w-[3rem] h-[3rem] rounded-[3rem]" src={image} alt="" />
                    </div>
                    <div>
                        <Link onClick={() => handleSetProfileVisits(uid)} to={`/u/${uid}`}>
                            <h2>{name}</h2>
                        </Link>
                        <p>{followersCount} followers</p>
                    </div>
                </div>
                <div>
                    <button className={`p-2 rounded-md ${isShowPop === _id ? 'bg-gray-200' : 'bg-gray-50'}`} onClick={() => handleShowUserDetail(_id)}><FaEllipsisH /></button>

                </div>
                {
                    isShowPop === _id ? (
                        <div
                            data-popover="popover"
                            className="absolute p-4 bg-white rounded-lg shadow-lg w-[22rem] text-blue-gray-500"
                        >
                            <button onClick={() => setIsShowPop(null)} className="absolute top-0 right-0 p-1.5 text-sm text-gray-500 hover:text-gray-700 focus:outline-none bg-gray-200">
                                <FaRegWindowMinimize />
                            </button>
                            <div className="mt-3 flex justify-between">
                                <div className="">
                                    <img className="w-[3rem] h-[3rem] rounded-[3rem]" src={image} alt="" />
                                    <div>
                                        <h2>{name}</h2>

                                        <span><p>{followersCount} followers</p></span>
                                    </div>
                                </div>
                                <div>
                                    {
                                        isFollowing ? (
                                            <div className="flex gap-2">
                                                <button className="btn btn-outline btn-sm">Following</button>
                                                <button className="btn btn-outline btn-sm">UnFollow</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleFollowUser(user?.uid, _id, uid)} className="btn btn-outline btn-sm">Follow</button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : null
                }

            </div>
        </div>
    );
};

User.propTypes = {
    users: PropTypes.object,
    handleFollowUser: PropTypes.func,
    handleSetProfileVisits: PropTypes.func,
    handleShowUserDetail: PropTypes.func,
    isShowPop: PropTypes.string,
}

export default User;