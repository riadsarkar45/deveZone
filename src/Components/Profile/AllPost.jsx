import PropTypes from 'prop-types';
import { FaRegTrashAlt } from "react-icons/fa";
import DOMPurify from 'dompurify';

const AllPost = ({ posts, i, followersLiked, handleEdit, isEditing }) => {
    const { title, category, likerIds, _id, content } = posts || {};
    const words = content.split(/\s+/);

    let truncatedContent = words.slice(0, 10).join(' ');

    if (words.length > 10) {
        truncatedContent += '...';
    }

    const sanitizedContent = DOMPurify.sanitize(truncatedContent);
    return (
        <tr onDoubleClick={() => handleEdit(_id)}>
            <th>{i + 1}</th>
            <td>
                {isEditing === _id ? (
                    <input className='p-1 bg-red-200 bg-opacity-20' type='text' value={title} />
                ) : (
                    title
                )}
            </td>
            <td>
                {isEditing === _id ? (
                    <input className='p-1 bg-red-200 bg-opacity-20' type='text' value={category} />
                ) : (
                    category
                )}
            </td>
            <td>
                {isEditing === _id ? (
                    <textarea value={content} className='p-1 w-[30rem] bg-red-200 bg-opacity-20' ></textarea>
                ) : (
                    <div className='mb-5' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                )}


            </td>
            {
                isEditing === _id ? (
                    null
                ) : (
                    <td className='flex gap-2 items-center'>
                        {likerIds && likerIds.length > 0 && (
                            <div className='flex gap-3'>
                                {followersLiked && likerIds.map(likerId => {
                                    const user = followersLiked.find(user => user.uid === likerId);
                                    if (user) {
                                        return (
                                            <div key={likerId}>
                                                <div>
                                                    <img className='w-[3rem] h-[3rem] rounded-[3rem]' src={user.image} />
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                        )}
                        {/* Display total likes count */}
                        {likerIds && <span>total ({likerIds.length})</span>}
                    </td>
                )
            }
            <td className=''>
               
            </td>

            <td className='flex'>
                {
                    isEditing === _id ? (
                        <>
                            <button onClick={() => handleEdit(false)} className="btn-error btn btn-sm">Can</button>
                            <button onClick={() => handleEdit(false)} className="btn-success btn btn-sm">Ok</button>
                        </>
                    ) : <button className="btn-error btn btn-sm"><FaRegTrashAlt /></button>
                }
            </td>
        </tr >

    );
};

AllPost.propTypes = {
    posts: PropTypes.object,
    i: PropTypes.number,
    followersLiked: PropTypes.array,
    handleEdit: PropTypes.func,
    isEditing: PropTypes.string,
}

export default AllPost;
