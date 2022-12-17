import React, { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import AutoAvatar from "../AutoAvatar";
import { TaskContext } from "../../context/TaskContext";
import { shortenAddress } from "../../utils/shortenAddress";
import languages from "../../utils/languages.json";

const Candidates = (candidates) => {
  const { composeCandidateProfiles } = useContext(TaskContext);
  const [candidateProfiles, setCandidateProfiles] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const c = await composeCandidateProfiles(candidates);
      setCandidateProfiles(c);
    };
    if (window.tronWeb) {
      fetchData().catch(console.error);
    }
    return () => {
      // this now gets called when the component unmounts
      setCandidateProfiles(null);
    };
  }, [candidates]);

  return (
    <div>
      {candidateProfiles &&
        candidateProfiles.map((p, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 justify-start items-start white-glassmorphism p-3 m-2"
          >
            <div className="flex flex-row justify-start items-center">
              {p.profile.avatar ? (
                <img
                  alt="Avatar"
                  className="w-[2.5rem] mr-1 rounded-full border"
                  src={p.profile.avatar}
                />
              ) : (
                <AutoAvatar userId={p.address} size={36} />
              )}
              {p.profile.username ? (
                <span>
                  {p.profile.username} ({shortenAddress(p.address)})
                </span>
              ) : (
                shortenAddress(p.address)
              )}
              <span className="pl-1">
                <FaStar color="#ffc107" size={20} />
              </span>
              {p.rating.toFixed(1)}
            </div>
            {p.profile.skills && <p>{p.profile.skills}</p>}
            {p.profile.languages && (
              <p>
                {p.profile.languages.map((l, j) => (
                  <span key={j} className="p-2 m-1 white-glassmorphism">
                    {languages.find((entry) => entry.code === l).name}
                  </span>
                ))}
              </p>
            )}
            <div className="flex flex-row w-full justify-between">
              {p.profile.rate > 0 && <span>${p.profile.rate}/hr</span>}
              {p.profile.availability > 0 && (
                <span>{p.profile.availability}hrs per week</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Candidates;
