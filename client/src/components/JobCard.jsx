import { Link } from "react-router-dom";

const getPlainText = (text) =>
  text
    ?.replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";

function JobCard({ job, showActions = false, onDelete, onEdit }) {
  const snippetSource = getPlainText(job.description);
  const descriptionWords = snippetSource.split(" ").filter(Boolean);
  const descriptionSnippet = descriptionWords.slice(0, 20).join(" ");

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <Link to={`/jobs/${job._id}`} className="text-2xl font-bold mb-2 block">
        {job.title}
      </Link>
      <p className="text-gray-600 mb-4">
        {job.location || "Location not specified"} •{" "}
        {job.jobType || "Job type not set"}
      </p>
      {descriptionSnippet && (
        <p className="mb-4 text-sm text-gray-700">
          {descriptionSnippet}
          {descriptionWords.length > 20 ? "..." : ""}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/jobs/${job._id}`}
          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
        >
          Job Details
        </Link>

        {showActions && (
          <>
            <button
              onClick={() => onEdit && onEdit(job)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default JobCard;
