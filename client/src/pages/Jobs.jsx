function Jobs() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Available Jobs</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sample Job Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Frontend Developer</h2>

          <p className="text-gray-600 mb-4">Berlin • Full-time</p>

          <p className="mb-4">
            Looking for React developer with strong JavaScript skills.
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Apply Now
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Backend Developer</h2>

          <p className="text-gray-600 mb-4">Munich • Full-time</p>

          <p className="mb-4">Node.js and MongoDB developer required.</p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
