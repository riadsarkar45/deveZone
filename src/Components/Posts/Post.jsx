import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthProvider/AuthProvider';
import { FaRegSave } from "react-icons/fa";

const Post = ({ post, handleSavePost }) => {
    const { user } = useContext(AuthContext)
    const { posterName, content, title, _id, category } = post;

    const words = content.split(/\s+/);

    // Select the first 100 words and join them back into a string
    let truncatedContent = words.slice(0, 50).join(' ');

    // Add ellipsis at the end if the original content is longer than 100 words
    if (words.length > 50) {
        truncatedContent += '...';
    }

    const sanitizedContent = DOMPurify.sanitize(truncatedContent);

    return (
        <div className="">
            <div className=" bg-opacity-30 p-2 border-b border-gray-300">
                <div className='flex justify-between'>
                    <div className="flex items-center gap-4">
                        <div>
                            <img className="w-[2rem] h-[2rem] rounded-[4rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                        </div>
                        <div>
                            <h2>{posterName}</h2>
                            <p>5 min</p>
                        </div>
                    </div>

                    <div>
                        <button onClick={() => handleSavePost(_id)} className="btn"><FaRegSave /></button>
                    </div>

                </div>

                <div>

                    <NavLink to={`/ddddd/${posterName}/${_id}/${user?.uid}`}><h2 className='text-black text-2xl mb-3'>{title}</h2></NavLink>
                    <div className='mb-5' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    <span className='bg-gray-200 p-1 mt-2 rounded-md mb-3'>{category}</span>
                </div>

            </div>

        </div>
    );
};

export default Post;