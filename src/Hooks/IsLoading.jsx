
const IsLoading = () => {
    return (
        <div className="flex items-center justify-center h-screen" >
            <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};

export default IsLoading;