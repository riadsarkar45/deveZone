import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider/AuthProvider";
import { useContext } from "react";

const Login = () => {
    const navigate = useNavigate()
    const { SignIn } = useContext(AuthContext)
    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        //const user = { email, password }

        SignIn(email, password)
            .then(result => {
                console.log(result);
                navigate("/");
            })
            .catch(error => {
                console.error(error)
            })
    }


    return (
        <div>
            <div className="flex items-center justify-center h-[100vh] font-serif bg-white bg-opacity-20 text-white">
                <form onSubmit={handleLogin}>
                    <div className="grid grid-cols-1 bg-white bg-opacity-20 shadow-md p-2 rounded-md">
                        <div>
                            <h2>Email</h2>
                            <input name="email" type="email" className="bg-white text-black p-3 mt-2 w-[30rem] rounded-md" />
                        </div>
                        <div>
                            <h2>Password</h2>
                            <input name="password" type="password" className="bg-white text-black p-3 mt-2 w-[30rem] rounded-md" />
                        </div>
                        <div className="text-center mt-7 ">
                            <button className="bg-green-500 shadow-[red] w-[13rem] bg-opacity-20 border border-green-500 rounded-md p-2">Login</button>
                        </div>
                        <p className="mt-3">Don{'`'}t have an account please <Link className="text-blue-900" to="/register">Register</Link></p>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Login;