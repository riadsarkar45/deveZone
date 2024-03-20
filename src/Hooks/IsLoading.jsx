
const IsLoading = () => {
    return (
        <>
            <div className="flex flex-col gap-4 w-full mt-10">
                <div className="flex gap-4 items-center">
                    <div className="skeleton w-[2rem] h-[2rem] rounded-[2rem] shrink-0"></div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-2 w-20"></div>
                        <div className="skeleton h-2 w-28"></div>
                    </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-6 w-[9rem]"></div>
            </div>
            <div className="flex flex-col gap-4 w-full mt-10">
                <div className="flex gap-4 items-center">
                    <div className="skeleton w-[2rem] h-[2rem] rounded-[2rem] shrink-0"></div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-2 w-20"></div>
                        <div className="skeleton h-2 w-28"></div>
                    </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-6 w-[9rem]"></div>
            </div>
        </>
    );
};

export default IsLoading;