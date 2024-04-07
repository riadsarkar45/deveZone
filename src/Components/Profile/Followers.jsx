import PropTypes from 'prop-types';
import { useContext } from 'react';
import { UserContext } from '../../Global/User';

const Followers = ({ user }) => {
    const { userInfo } = useContext(UserContext);
    const { name, image, followers, uid } = user || {};
    const isCurrentUserFollowing = followers?.includes(userInfo?.uid);
    const isCurrentUser = userInfo?.uid === uid;
    return (
        <div className=" p-2 mt-3 border-b border-gray-200">
            <div className='flex justify-between'>
                <div className='flex items-center gap-3'>
                    <img className='w-[3rem] h-[3rem] rounded-[3rem]' src={image} alt="" />
                    <h2 className=' text-xl'>{name}</h2>
                </div>
                <div>
                    {isCurrentUser ? (
                        <button className='btn btn-sm btn-outline'>You</button>
                    ) : (
                        <button className='btn btn-sm btn-outline'>
                            {isCurrentUserFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
Followers.propTypes = {
    user: PropTypes.object,
}
export default Followers;