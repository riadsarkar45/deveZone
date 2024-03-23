import PropTypes from 'prop-types';

const Topics = ({ cat, toggleTagSelection, selectedCategory, suggestions }) => {
    const { name, posts } = cat || {};
    return (
        <div>
            <div className={`cursor-pointer rounded-md border border-gray-200  p-3 ${selectedCategory.includes(name) ? 'bg-green-500 bg-opacity-60 shadow-lg' : 'bg-blue-500 bg-opacity-60 shadow-sm'} text-xl text-white`} onClick={() => toggleTagSelection(name)}>
                <h2>{name}</h2>
                <p className='text-sm'>{posts} posts</p>
            </div>
            {
                suggestions.map((suggestion, index) => (
                    <div key={index} className={`cursor-pointer rounded-md border border-gray-200 text-center p-3 ${selectedCategory.includes(suggestion) ? 'bg-green-500 bg-opacity-60 shadow-lg' : 'bg-blue-500 bg-opacity-60 shadow-sm'} text-xl text-white`} onClick={() => toggleTagSelection(suggestion)}>
                        <h2>{suggestion}</h2>
                    </div>
                ))
            }
        </div>
    );
};

Topics.propTypes = {
    cat: PropTypes.object,
    toggleTagSelection: PropTypes.func,
    selectedCategory: PropTypes.array,
    suggestions: PropTypes.array,
}

export default Topics;
