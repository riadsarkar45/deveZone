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
            if(!user) return null
            const res = await axiosPublic.get(`/users/${user?.uid}`);
            setUsers(res.data);
            return res.data;
        },
        enabled: !!user
    });

    const handleFollowUser = (uid, id, followingToId) => {
        axiosPublic.put(`/follow-user/${id}/${uid}/${followingToId}`).then(() => refetch())
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