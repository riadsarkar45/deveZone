import PropTypes from 'prop-types';
import { FaRegTrashAlt } from "react-icons/fa";

const AllPost = ({ posts, i, followersLiked,  }) => {
    const { title, category, likerIds } = posts || {};

    return (
        <tr>
            <th>{i + 1}</th>
            <td>{title}</td>
            <td>{category}</td>
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

            <td><button className="btn-error btn btn-sm"><FaRegTrashAlt /></button></td>
        </tr>
    );
};

AllPost.propTypes = {
    posts: PropTypes.object,
    i: PropTypes.number,
    followersLiked: PropTypes.array,
}

export default AllPost;
