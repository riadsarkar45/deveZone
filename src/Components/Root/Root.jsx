import { Toaster } from 'react-hot-toast';
import Header from './Header';
import { Outlet } from 'react-router-dom';
const Root = () => {
    return (
        <div>
            <Header />
            <Outlet></Outlet>
            <Toaster />
        </div>
    );
};

export default Root;