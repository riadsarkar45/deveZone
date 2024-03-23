
const Following = ({ follows }) => {
    const { name, image } = follows || {};
    return (
        <div>
            <div className="flex items-center gap-4">
                <img className="w-[3rem] h-[3rem] rounded-[3rem] mt-3" src={image} alt="" />
                <div className="mb-3">
                    <h2 className="font-bold">{name}</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Eaque voluptatum dolorem architecto commodi laboriosam ab
                        voluptates esse, earum saepe quidem quisquam eum excepturi.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Following;