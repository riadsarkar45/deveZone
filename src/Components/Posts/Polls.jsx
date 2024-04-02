import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Global/User";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
const Polls = ({ poll }) => {
    const { pollTitle, options, _id, } = poll || {};
    const { userInfo } = useContext(UserContext)
    const axiosPublic = useAxiosPublic()
    const [showResult, setShowResult] = useState(false)
    const [result, setResult] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const { refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await axiosPublic.get(`/get-poll-result/${_id}`)
                setResult(res.data)
                setIsLoading(false)
                return res.data;
            } catch (error) {
                console.error("Error fetching posts:", error);
                return null;
            }
        },
    })


    const handleSubmitVote = (options) => {
        const dataToSend = { options, pollId: _id, userId: userInfo?.uid, votes: 1, userIds: [userInfo?.uid] }
        axiosPublic.put(`/submit-vote/${_id}/${userInfo?.uid}`, dataToSend).then(() => refetch())
    }

    const handleModal = () => {
        setShowResult(bool => !bool)
        axiosPublic.get(`/get-poll-result/${_id}`).then((res) => { setResult(res.data), setIsLoading(false) })
    }

    const getVotedIds = result?.flatMap(ids => ids.userIds)
    console.log(getVotedIds);
    const isVoted = getVotedIds && getVotedIds?.includes(userInfo?.uid);
    
    return (
        <div className="mt-6 mb-4 shadow-sm bg-opacity-30 p-2 border-b border-gray-300">
            {
                showResult ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div data-popover="popover" className="relative p-4 bg-gray-100 rounded-lg shadow-lg w-[52rem] max-h-screen overflow-y-auto text-blue-gray-500">
                            <button
                                onClick={handleModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="mt-3">

                                <h2 className="text-2xl border-b border-gray-300 p-2">Poll Result</h2>
                                {
                                    isLoading ? (
                                        <>
                                            <div className="flex flex-col gap-4 w-full">
                                                <div className="skeleton h-4 w-28"></div>
                                                <div className="skeleton h-4 w-full"></div>
                                                <div className="skeleton h-4 w-full"></div>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            {
                                                result?.length <= 0 ? (
                                                    <div className="flex mt-6">
                                                        <h2 className="text-center">No votes</h2>
                                                    </div>
                                                ) : (
                                                    result?.map((res, i) =>
                                                        <div key={i} className="flex justify-between mt-2">
                                                            <div>
                                                                <span>{res.options}</span>
                                                            </div>
                                                            <div>
                                                                <span>Votes ({res?.votes})</span>
                                                            </div>
                                                        </div>

                                                    )
                                                )
                                            }
                                        </div>
                                    )
                                }


                            </div>
                        </div>
                    </div>
                ) : null
            }
            <h2 className="text-2xl">{pollTitle}</h2>
            <div>
                {
                    options?.map((opt, i) => (
                        <div key={i}>
                            <div className="flex justify-between">
                                <div>
                                    <span className="mt-3 text-xl">{opt.text}</span>
                                </div>
                                <div>
                                    <input

                                        onClick={() => handleSubmitVote(opt.text)}
                                        type="radio"
                                        id={`option-${i}`}
                                        name="vote-option"
                                        value={opt.text}
                                        disabled={isVoted}
                                        className={`${isVoted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className="flex justify-end">
                    <button onClick={handleModal} className="btn btn-sm btn-outline mt-4 ">See Results</button>
                </div>
            </div>
        </div>
    );
};

export default Polls;