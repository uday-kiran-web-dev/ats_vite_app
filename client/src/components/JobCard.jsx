function JobCard({ job, onApply, showActions = false, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-2">
        {job.location} • {job.jobType}
      </p>
      <p className="mb-4 text-gray-700">{job.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements?.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {onApply && (
          <button
            onClick={() => onApply(job._id)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply
          </button>
        )}

        {showActions && (
          <>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Edit
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
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
