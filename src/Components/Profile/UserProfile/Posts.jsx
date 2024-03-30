import PropTypes from 'prop-types';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { FaEllipsisH } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const Posts = ({ post, isShowFollowers }) => {
    const { title, content, category } = post
    const words = content.split(/\s+/);

    let truncatedContent = words.slice(0, 50).join(' ');

    if (words.length > 50) {
        truncatedContent += '...';
    }

    const sanitizedContent = DOMPurify.sanitize(truncatedContent);
    return (
        <div>
            
            <div className="border-b-2 shadow-sm p-2 mt-4 border-gray-200 mb-3">
                <h2 className="text-xl font-bold">{title}</h2>
                <div className='mb-5' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

                <div className="mt-2 mb-3 flex items-center justify-between">
                    <span className="bg-gray-500 rounded-md p-1 bg-opacity-25">{category}</span>
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="text-gray-500 text-xl"><BookmarkAddIcon /></span>
                        </div>
                        <div>
                            <FaEllipsisH />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Posts.propTypes = {
    post: PropTypes.object,
    isShowFollowers: PropTypes.bool,

};

export default Posts;