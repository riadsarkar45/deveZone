import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useContext, useState } from "react";
import DOMPurify from 'dompurify';
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";
import { FaAssistiveListeningSystems, FaComments, FaThumbsUp } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Comments from "./Comments";
import toast from "react-hot-toast";

const Detail = () => {
    const axiosPublic = useAxiosPublic();
    const { writer, id, uid } = useParams();
    const { user } = useContext(AuthContext)
    const dataToSend = { writer, id, uid }
    const [post, setPost] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState('');
    const [comment, setComments] = useState('')
    const [postId, setPostId] = useState('')
    const [getComments, setGetComments] = useState([])
    const [commentLoading, setCommentLoading] = useState(true)
    const [indexId, setIndexId] = useState('')
    const [cmtReplyText, setCmtReplyText] = useState('')
    const [followingLikes, setFollowingLikes] = useState([])
    const { refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            if(!user) return null
            const res = await axiosPublic.post(`/get/post`, dataToSend);
            const cmt = await axiosPublic.get(`/comments/${id}`);
            
            setGetComments(cmt.data)
            setCommentLoading(false)
            setPost(res.data);
            setIsLoading(false)
            return res.data;
        },
        enabled: !!user
    });

    const { title, content, likes, likerIds, totalComment } = post;
    const isMatched = likerIds && likerIds.includes(user?.uid)
    const sanitizedContent = DOMPurify.sanitize(content);
    const handleLikes = () => {
        axiosPublic.put(`/add-like/${uid}/${id}`).then((res) => { console.log(res.data), refetch() })
    }

    const handleAddComments = () => {
        const dataToInsert = { userEmail: user?.email, postId: id, cmt: comment, replies: [] }
        axiosPublic.post('/post-comments', dataToInsert).then(() => refetch(), toast.success('Comment Added'))
    }

    const handleGetComments = () => {
        axiosPublic.get(`/comments/${id}`, postId).then(res => { setGetComments(res.data), setCommentLoading(false) })
    }

    const getCommentId = (index) => {
        setIndexId(index)
    }

    const handleCommentReply = (repliesText) => {
        setCmtReplyText(repliesText);
    }

    const handleSubmitCommentReplies = (commentId) => {
        const dataToUpdate = { userName: user?.email, reply: cmtReplyText }
        axiosPublic.put(`/comment-replies/${commentId}`, dataToUpdate).then(() => refetch())
    }

    const handleCommentLikes = (commentId) => {
        axiosPublic.put(`/like-comment/${commentId}/${user?.uid}`).then(() => refetch())
    }

    const anchor = 'right';

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setIsOpen(open);
    };

    const list = (
        <div className=" w-[25rem] h-screen p-1">
            <div className=" p-2 shadow-lg">
                <div className="flex gap-3 items-center mb-4">
                    <img className="w-[2rem] h-[2rem] rounded-[2rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="userImage" />
                    <h2>Riad Sarkar</h2>
                </div>
                <textarea onChange={e => setComments(e.target.value)} className="border border-gray-200 shadow-lg w-full rounded-sm p-1" name="" placeholder="What are your thoughts?" id="" rows="6"></textarea>
                <div>
                    <div className="flex justify-end gap-3 mt-2 items-center">
                        <button className="text-white btn btn-md">Cancel</button>
                        <button onClick={handleAddComments} className="text-white btn-success btn btn-md">Respond</button>
                    </div>
                </div>
            </div>


            {
                commentLoading ? (
                    <div className="flex flex-col gap-4 w-full mt-10">
                        <div className="flex gap-4 items-center">
                            <div className="skeleton w-[2rem] h-[2rem] rounded-[2rem] shrink-0"></div>
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-2 w-20"></div>
                                <div className="skeleton h-2 w-28"></div>
                            </div>
                        </div>
                        <div className="skeleton h-32 w-full"></div>
                    </div>
                ) : getComments?.map((cmt, i) => <Comments key={i} handleCommentLikes={handleCommentLikes} handleSubmitCommentReplies={handleSubmitCommentReplies} handleCommentReply={handleCommentReply} indexId={indexId} index={i} getCommentId={getCommentId} cmts={cmt}></Comments>)
            }
        </div>
    );
    return (
        <div className='w-[60%] m-auto  mt-5'>
            {
                isLoading ? (
                    <><isLoading /></>
                ) : <div>
                    <h2 className='text-3xl'>{title}</h2>
                    <div className="mt-8 flex gap-2">
                        <img className='w-[4rem] rounded-[4rem] h-[4rem]' src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                        <div>
                            <h2>Shi Ji Ping</h2>
                            <h2>5 min read - Jan 28, 2024</h2>
                        </div>
                    </div>
                    <div className="flex mt-3 gap-3 items-center ">

                        {
                            followingLikes?.map((likes, i) =>
                                <div key={i} className="">
                                    <img className="w-[3rem] h-[3rem] rounded-[3rem]" src={likes.image} alt="" />
                                </div>
                            )
                        }
                        <span>  likes this post</span>
                    </div>
                    <div className="border-t border-b border-gray-500 p-3 mt-4">
                        <div className='flex justify-between'>
                            <div className='flex gap-3'>
                                {
                                    isMatched ? (
                                        <h2 className="cursor-pointer flex items-center gap-2" onClick={handleLikes}>{likes} <span className="text-blue-500"><FaThumbsUp /></span></h2>
                                    ) : (
                                        <h2 className="cursor-pointer flex items-center gap-2" onClick={handleLikes}>{likes} <span className=""><FaThumbsUp /></span></h2>
                                    )
                                }
                                <div onClick={() => { setIsOpen(true); setPostId(id) }} className="cursor-pointer flex items-center gap-3">
                                    <button onClick={() => handleGetComments()}><FaComments /></button>
                                    <h2><span>{totalComment}</span></h2>
                                </div>

                            </div>
                            <div className='flex gap-3 items-center text-2xl'>
                                <h2><FaRegSave /></h2>
                                <h2><FaAssistiveListeningSystems /></h2>
                                <h2><FaRegShareSquare /></h2>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

                    </div>
                </div>
            }

            <SwipeableDrawer
                anchor={anchor}
                open={isOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                {list}
            </SwipeableDrawer>
        </div>
    );
};

export default Detail;