import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useContext, useState } from "react";
import User from "./User";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";

const Users = () => {
    const { user } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const axiosPublic = useAxiosPublic();
    const { refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user?.uid}`);
            setUsers(res.data);
            return res.data;
        },
    });

    const handleFollowUser = (uid, id, followingToId) => {
        axiosPublic.put(`/follow-user/${id}/${uid}/${followingToId}`).then(res => console.log(res.data), refetch(),)
    }
    return (
        <div>
            <div className=" p-1 mt-3">
                {
                    users?.map((users, i) =>
                        <User
                            key={i}
                            users={users}
                            handleFollowUser={handleFollowUser}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default Users;