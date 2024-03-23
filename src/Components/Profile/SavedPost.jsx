import PropTypes from 'prop-types';
import { FaRegTrashAlt } from "react-icons/fa";
const SavedPost = ({posts, i}) => {
    const {title, category, likerIds} = posts || {};
    return (
        <tr>
            <th>{i+ 1}</th>
            <td>{title}</td>
            <td>{category}</td>
            <td>{likerIds.length}</td>
            <td><button className="btn-error btn btn-sm"><FaRegTrashAlt /></button></td>
        </tr>
    );
};

SavedPost.propTypes = {
    posts: PropTypes.object,
    i: PropTypes.number,
}

export default SavedPost;