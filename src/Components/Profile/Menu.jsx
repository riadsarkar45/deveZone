import PropTypes from 'prop-types';

const Menu = ({menu, handleClickMenu, clickedMenu}) => {
    const {name, icon} = menu || {};
    return (
        <li onClick={() => handleClickMenu(name)} className={`"p-3 mt-3 hover:bg-gray-200 ${name === clickedMenu ? 'bg-gray-200': ''} cursor-pointer mb-3 flex items-center gap-3"`}>{icon} {name}</li>
    );
};

Menu.propTypes = {
    menu: PropTypes.object,
    handleClickMenu: PropTypes.function,
    clickedMenu: PropTypes.string,
}

export default Menu;