import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Global/User";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import PropTypes from 'prop-types';
const Polls = ({ poll }) => {
    const { pollTitle, options, _id, } = poll || {};
    const { userInfo } = useContext(UserContext)
    const axiosPublic = useAxiosPublic()
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

    useEffect(() => {
        refetch()
    }, [refetch])


    const handleSubmitVote = (options) => {
        const dataToSend = { options, pollId: _id, userId: userInfo?.uid, votes: 1, userIds: [userInfo?.uid] }
        axiosPublic.put(`/submit-vote/${_id}/${userInfo?.uid}`, dataToSend).then(() => refetch())
    }


    const totalVotes = result.reduce((total, option) => total + option.votes, 0);
    // const getVotedIds = result?.flatMap(ids => ids.userIds)
    // const isVoted = getVotedIds && getVotedIds?.includes(userInfo?.uid);

    return (
        <div className="mt-6 mb-4 shadow-sm bg-opacity-30 p-2 border-b border-gray-300">
            <div className="flex items-center gap-2">
                <div>
                    <img className="h-[2rem] w-[2rem] rounded-[2rem]" src="https://i.ibb.co/0ZZFhPN/ddddddddddddddddddddd.jpg" alt="" />
                </div>
                <div>
                    <h2>Head Shot</h2>
                    <small>5min</small>

                    <p className="mb-4"><b>Head Shot</b> Created a poll</p>
                </div>
            </div>
            <h2 className="text-2xl mb-3">{pollTitle}</h2>
            <div>
                {options?.map((opt, i) => {
                    const optionVotes = result.find(r => r.options === opt.text)?.votes || 0;
                    const percentage = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(2) : 0;
                    let progress_bar_class = '';
                    if (percentage >= 40) {
                        progress_bar_class = 'bg-green-500';
                    }
                    else if (percentage >= 25 && percentage < 40) {
                        progress_bar_class = 'bg-blue-500';
                    }
                    else if (percentage >= 10 && percentage < 25) {
                        progress_bar_class = 'bg-yellow-600';
                    }
                    else {
                        progress_bar_class = 'bg-red-600';
                    }
                    return (
                        <div key={i}>
                            <div className="flex justify-between">

                                <div className="flex gap-2">
                                    <div>
                                        <input
                                            onClick={() => handleSubmitVote(opt.text)}
                                            type="radio"
                                            id={`option-${i}`}
                                            name="vote-option"
                                            value={opt.text}
                                            // disabled={result.some(vote => vote.userIds.includes(userInfo?.uid))}
                                            className={`${result.some(vote => vote.userIds.includes(userInfo?.uid)) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        />

                                    </div>
                                    <div>
                                        <span className="mt-3 text-xl">{opt.text}</span>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="w-[25rem] bg-gray-200 rounded-full dark:bg-gray-700">
                                        <div
                                            className={`${progress_bar_class} text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`}
                                            style={{ width: `${percentage}%` }} // Concatenate the percentage within curly braces
                                        >
                                            {percentage}%
                                        </div>
                                    </div>



                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

Polls.propTypes = {
    poll: PropTypes.object,
}

export default Polls;