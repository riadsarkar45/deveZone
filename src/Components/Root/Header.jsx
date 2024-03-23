import { NavLink } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../../Global/User";
const Header = () => {
    const { userInfo } = useContext(UserContext)
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <details>
                            <summary>
                                {userInfo?.name}
                            </summary>
                            <ul className="p-2 bg-base-100 rounded-t-none">
                                <li><NavLink to='/profile'>Profile</NavLink></li>
                            </ul>
                        </details>
                    </li>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/add-post'><FaPen />Write</NavLink></li>

                </ul>
            </div>
        </div>

    );
};

export default Header;