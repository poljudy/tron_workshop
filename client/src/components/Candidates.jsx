import { FaStar } from "react-icons/fa";

const Candidates = (props) => {
  const { candidates } = props;
  if (candidates) {
    return (
      <div className="flex flex-wrap justify-start items-center">
        <ul>
          {candidates.map((candidate, i) => (
            <li key={i} className="flex flex-row justify-center items-center">
              <span>{candidate.candidate}</span>{" "}
              <span className="flex flex-row justify-center items-center m-2">
                {[...Array(5)].map((star, index) => (
                  <FaStar
                    key={index}
                    color={candidate.rating > index ? "#ffc107" : "#e4e5e9"}
                    size={20}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <p className="text-white text-xl my-2">
      No candidates applied yet
    </p>
  );
};

export default Candidates;
