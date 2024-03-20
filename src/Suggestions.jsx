import PropTypes from 'prop-types';
const Suggestions = ({ cat, suggestions, toggleTagSelection, selectedTags }) => {
    const { cateName } = cat;


    return (
        <>
            <div className={`cursor-pointer rounded-md border border-gray-200 text-center p-3 ${selectedTags.includes(cateName) ? 'bg-green-500 bg-opacity-60' : 'bg-blue-500 bg-opacity-60'} text-xl text-white`} onClick={() => toggleTagSelection(cateName)}>
                <h2>{cateName}</h2>
            </div>
            {
                suggestions.map((suggestion, index) => (
                    <div key={index} className={`cursor-pointer rounded-md border border-gray-200 text-center p-3 ${selectedTags.includes(suggestion) ? 'bg-green-500 bg-opacity-60' : 'bg-blue-500 bg-opacity-60'} text-xl text-white`} onClick={() => toggleTagSelection(suggestion)}>
                        <h2>{suggestion}</h2>
                    </div>
                ))
            }
        </>
    );
};

Suggestions.propTypes = {
    suggestions: PropTypes.array,
    toggleTagSelection: PropTypes.func,
    selectedTags: PropTypes.array,
    cat: PropTypes.object,
}

export default Suggestions;
