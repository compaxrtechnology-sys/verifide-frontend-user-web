import {
  BiImage,
  BiLink,
  BiPoll,
  BiChevronRight,
  BiCheck,
} from "react-icons/bi";
import { useState } from "react";
import { toast } from "sonner";
// import PollFormUser from "./PollFormUser";
import { formatDateByMomentTimeZone } from "../../../components/utils/globalFunction";

const QuestPostCard = ({ post, onVote }) => {
  const [pollExpanded, setPollExpanded] = useState(false);
  const [votedOption, setVotedOption] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const quest = post?.quest_id || post; // supports populated or flattened data

  const handleVoteClick = (optionIndex) => {
    if (quest?.isVoted) {
      toast.info("You already voted in this poll");
      return;
    }
    onVote?.(quest._id, optionIndex);
    setVotedOption(optionIndex);
  };

  if (!quest) return null;

  return (
    <>
      <div className="relative glassy-card rounded-xl border border-[#D3D3D3] overflow-hidden">
        {/* MEDIA */}
        <div className="h-48 relative overflow-hidden">
          {quest?.video ? (
            <video
              src={quest.video}
              className="w-full h-full object-cover"
              controls
              poster={quest.images?.[0]}
            />
          ) : quest.images?.length > 0 ? (
            <img
              src={quest.images[0]}
              alt={quest.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/Frame 1000004906.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <BiImage className="text-4xl text-gray-400" />
            </div>
          )}

          {/* AUTHOR */}
          <div className="absolute bottom-3 left-3 flex items-center glassy-card px-2 py-1">
            <img
              src={
                quest?.user_id?.profile_picture_url ||
                "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
              }
              className="w-6 h-6 rounded-full mr-2 border"
              alt="author"
            />
            <span className="text-xs font-medium">
              {quest?.user_id?.name}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="font-bold text-lg glassy-text-primary capitalize">
            {quest.title}
          </h3>

          <p className="glassy-text-secondary text-sm mt-1 line-clamp-3">
            {quest.description}
          </p>

          <div className="text-xs glassy-text-secondary mt-2">
            {formatDateByMomentTimeZone(post.createdAt)}
          </div>

          {/* POLL */}
          {quest.poll && quest.poll.options?.length > 0 && (
            <div className="mt-4 glassy-card rounded-lg border overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setPollExpanded(!pollExpanded)}
              >
                <div className="flex items-center text-sm font-medium">
                  <BiPoll className="mr-2 text-blue-500" />
                  Community Poll ({quest.poll.total_votes} votes)
                </div>
                <BiChevronRight
                  className={`transition-transform ${
                    pollExpanded ? "rotate-90" : "-rotate-90"
                  }`}
                />
              </div>

              {pollExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {quest.poll.options.map((option, idx) => {
                    const percentage =
                      quest.poll.total_votes > 0
                        ? Math.round(
                            (option.vote_count / quest.poll.total_votes) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={idx}
                        className="cursor-pointer"
                        onClick={() => handleVoteClick(idx)}
                      >
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>{option.text}</span>
                          <span className="text-blue-600">
                            {percentage}%
                          </span>
                        </div>

                        <div className="w-full h-2 glassy-card rounded-full">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        {votedOption === idx && (
                          <span className="text-xs text-green-600 flex items-center mt-1">
                            <BiCheck className="mr-1" /> Voted
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* LINK */}
          {quest.link && (
            <a
              href={quest.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 mt-3 truncate"
            >
              <BiLink />
              {quest.link.replace(/(^\w+:|^)\/\//, "")}
            </a>
          )}
        </div>
      </div>

      {/* POLL MODAL */}
      {/* {quest.type === "survey-polls" && (
        <PollFormUser
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          quest={quest}
        />
      )} */}
    </>
  );
};

export default QuestPostCard;
