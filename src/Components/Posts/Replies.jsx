
const Replies = ({rep}) => {
    const {userName, reply} = rep;
    return (
        <div className=" ml-10 border-l-2 border-gray-200 p-3">
            <div className="flex items-center gap-3">
                <img className="w-[2rem] h-[2rem] rounded-[2rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                <h2>{userName}</h2>
            </div>
            <p className="ml-6">{reply}</p>
        </div>
    );
};

export default Replies;