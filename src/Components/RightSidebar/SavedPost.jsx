
const SavedPost = ({posts}) => {
    const {title, posterName} = posts;
    return (
        <div>
        <div>
            <div className="flex mt-3">
                <img className="w-[2rem] h-[2rem] rounded-[2rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                <h2>{posterName}</h2>
            </div>
            <p className="font-semibold">{title}</p>
        </div>
        </div>
    );
};

export default SavedPost;