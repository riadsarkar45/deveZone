import PropTypes from 'prop-types';

const SelectedCategory = ({ topics }) => {
    return (

        <li className="p-1 border-b border-gray-400">{topics}</li>

    );
};

SelectedCategory.propTypes = {
    topics: PropTypes.object.string,
};

export default SelectedCategory;