
const Categories = ({ cat, gePosts, selectedCategory }) => {
    const { cateName } = cat;
    return (
        <div className="cursor-pointer">
            <h2 onClick={() => gePosts(cateName)} className={selectedCategory === cateName ? 'border-b border-blue-500 p-1' : 'p-1'}>{cateName}</h2>
        </div>
    );
};

export default Categories;