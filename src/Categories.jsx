import PropTypes from 'prop-types';

const Categories = ({ cats, gePosts, selectedCategory }) => {
    
    return (
        <div className="cursor-pointer">
            <h2 onClick={() => gePosts(cats)} className={selectedCategory === cats ? 'border-b border-blue-500 p-1' : 'p-1'}>{cats}</h2>
        </div>
    );
};
Categories.propTypes = {
    gePosts: PropTypes.func,
    cats: PropTypes.string,
    selectedCategory: PropTypes.string,
}
export default Categories;