import PropTypes from 'prop-types';
import { useContext } from 'react';
import { UserContext } from '../../Global/User';

const Followers = ({ user }) => {
    const { userInfo } = useContext(UserContext);
    const { name, image, followers, following } = user || {};
    const isFollowing = followers?.includes(userInfo?.uid);
    const check = following && following?.includes(userInfo.uid)
    return (
        <div className=" p-2 mt-3 border-b border-gray-200">
            <div className='flex justify-between'>
                <div className='flex items-center gap-3'>
                    <img className='w-[3rem] h-[3rem] rounded-[3rem]' src={image} alt="" />
                    <h2 className=' text-xl'>{name}</h2>
                </div>
                <div>
                    {
                        check ? (
                            <button className='btn btn-sm btn-outline'>{isFollowing ? 'Following' : 'Follow'}</button>
                        ) : <button className='btn btn-sm btn-outline'>You</button>
                    }
                </div>
            </div>
        </div>
    );
};
Followers.propTypes = {
    user: PropTypes.object,
}
export default Followers;