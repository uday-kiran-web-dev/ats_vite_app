function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-lg mb-2">{title}</h3>

      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

export default Card;
