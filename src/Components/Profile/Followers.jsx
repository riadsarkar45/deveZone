
const Followers = () => {
    return (
        <div className=" p-1 mt-3">
            <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div>
                        <img className="w-[3rem] h-[3rem] rounded-[3rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                    </div>
                    <div>
                        <h2>Raka Sarkar</h2>
                        <p>1k followers</p>
                    </div>
                </div>
                <div>
                    <button className="btn border-teal-300 p-2 btn-sm">Follow Back</button>
                </div>
            </div>
        </div>
    );
};

export default Followers;