import { FaThumbsUp } from "react-icons/fa";
import Replies from "./Replies";
import { useContext } from "react";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";

const Comments = ({ cmts, handleCommentLikes, getCommentId, handleSubmitCommentReplies, index, indexId, handleCommentReply }) => {
    const { user } = useContext(AuthContext)
    const { userEmail, cmt, _id, replies, likes, totalLikes } = cmts;
    const isMatched = likes && likes.includes(user?.uid);
    
    return (
        <div>
            <div className="flex items-center gap-4 mt-5 p-2">
                <div>
                    <img className="w-[2rem] h-[2rem] rounded-[2rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                </div>
                <div>
                    <h2>{userEmail}</h2>
                    <h2>Just now</h2>
                </div>
            </div>
            <p className="ml-2">{cmt}</p>
            {
                index === indexId ? (
                    <div className="mt-4">
                        <input onChange={e => handleCommentReply(e.target.value)} className="w-full p-2 rounded-md border border-gray-400" placeholder="Reply" type="text" />
                    </div>
                ) : null
            }
            <div className="flex justify-between mt-5 text-xl p-1">
                {
                    isMatched ? (
                        <span className="text-blue-500 flex items-center gap-2">{totalLikes}<FaThumbsUp /></span>
                    ) : <span className="cursor-pointer flex items-center gap-2" onClick={() => handleCommentLikes(_id)}>{totalLikes}<FaThumbsUp /></span>
                }
                {
                    index === indexId ? (
                        <div className="flex gap-3">
                            <span className="cursor-pointer btn btn-sm btn-danger" onClick={() => getCommentId(false)}>Cancel</span>
                            <span className="cursor-pointer btn btn-sm btn-success" onClick={() => handleSubmitCommentReplies(_id)}>Respond</span>
                        </div>
                    ) : <span className="cursor-pointer" onClick={() => getCommentId(index)}>Reply</span>
                }

            </div>

            <div>
                {
                    replies?.map((rep, i) => <Replies key={i} rep={rep}></Replies>)
                }
            </div>
            <div className=" border-b border-gray-200 mt-3"></div>
        </div>
    );
};

export default Comments;