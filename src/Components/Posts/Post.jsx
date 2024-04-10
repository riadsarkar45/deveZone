import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthProvider/AuthProvider';
import { FaRegSave } from "react-icons/fa";
import PropTypes from 'prop-types';

const Post = ({ post, allList, handleSubmit, handleSavePost, handleSaveCreatedList, handleUpdatePostClicks, handleCreateList, createList, setCreateList }) => {
    const { user } = useContext(AuthContext)
    const { posterName, content, title, _id, category } = post;
    const words = content.split(/\s+/);
    let truncatedContent = words.slice(0, 50).join(' ');
    if (words.length > 50) {
        truncatedContent += '...';
    }
    const sanitizedContent = DOMPurify.sanitize(truncatedContent);



    return (
        <div className="">

            {
                createList === _id ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div data-popover="popover" className="relative p-4 bg-gray-100 rounded-lg shadow-lg w-[25.9rem] max-h-screen overflow-y-auto text-blue-gray-500">
                            <button
                                onClick={() => setCreateList(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="mt-1">
                                <small className="border-b  border-gray-300">Create List</small>
                                <div className="mt-6">
                                    {
                                        allList?.map((lists, i) => {
                                            return (
                                                <div key={i}>
                                                    <input  onClick={() => handleSavePost(_id, lists.listName)} name='head shot' type="radio" /> {lists.listName}
                                                </div>
                                            )
                                        })
                                    }

                                    <div className='flex shadow-sm gap-1 items-center border border-gray-300 mt-4'>
                                        <div>
                                            <input onChange={e => handleSaveCreatedList(e.target.value)} className='w-[18rem] p-2' type="text" />
                                        </div>
                                        <div>
                                            <button onClick={() => handleSubmit()} className=''><span>Create List</span></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            }

            <div className="shadow-sm bg-opacity-30 p-2 border-b border-gray-300">
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
                        <button onClick={() => handleCreateList(_id)} className="btn"><FaRegSave /></button>
                    </div>

                </div>

                <div>

                    <NavLink onClick={() => handleUpdatePostClicks(_id)} to={`/ddddd/${posterName}/${_id}/${user?.uid}`}><h2 className='text-black text-2xl mb-3'>{title}</h2></NavLink>
                    <div className='mb-5' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    <span className='bg-gray-200 p-1 mt-2 rounded-md mb-3'>{category}</span>
                </div>

            </div>



        </div>
    );
};

Post.propTypes = {
    polls: PropTypes.array,
    allList: PropTypes.array,
    post: PropTypes.object,
    createList: PropTypes.string,
    handleSubmit: PropTypes.func,
    setCreateList: PropTypes.func,
    handleSavePost: PropTypes.func,
    handleCreateList: PropTypes.func,
    handleSaveCreatedList: PropTypes.func,
    handleUpdatePostClicks: PropTypes.func,
}

export default Post;