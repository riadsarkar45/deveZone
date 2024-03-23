import { Outlet } from 'react-router-dom';
import Profile from './Profile';
import Following from './Following';

const Paren = () => {
    return (
        <div className='w-[70%] m-auto'>
            <Profile/>
            <Outlet/>
            <Following/>
        </div>
    );
};

export default Paren;