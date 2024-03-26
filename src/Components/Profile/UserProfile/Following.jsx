import { Box, Fade, Popper } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { AuthContext } from '../../../Auth/AuthProvider/AuthProvider';
import { UserContext } from '../../../Global/User';

const Following = ({ users }) => {
    const { image, name, followers } = users || {};
    const { user } = useContext(AuthContext)
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { userInfo } = useContext(UserContext)
    const isFollowing = followers && followers?.includes(user?.uid);
    const check = followers && followers?.includes(userInfo.uid)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;
    return (
        <div>
            <div className='flex items-center justify-between mt-3'>
                <div className='flex items-center gap-3'>
                    <img className='w-[3rem] h-[3rem] rounded-[3rem]' src={image} alt="" />
                    <h2>{name}</h2>
                </div>

                <span onClick={handleClick}><FaEllipsisH /></span>
            </div>
            <Popper id={id} open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', width: '25rem' }}>
                            <div>
                                <div className='flex items-center gap-3 mb-4'>
                                    <img className='w-[3rem] h-[3rem] rounded-[3rem]' src={image} alt="" />
                                    <h2>{name}</h2>
                                </div>
                                <div className="border-t border-gray-500 flex justify-between p-2">
                                    <span>{followers.length} Followers</span>
                                    {
                                        check ? (
                                            <button className='btn btn-success btn-sm btn-outline'>{isFollowing ? 'Following' : 'Follow'}</button>
                                        ) : <button className='btn btn-success btn-sm btn-outline'>You</button>
                                    }
                                </div>
                            </div>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};

Following.propTypes = {
    users: PropTypes.object,

};

export default Following;