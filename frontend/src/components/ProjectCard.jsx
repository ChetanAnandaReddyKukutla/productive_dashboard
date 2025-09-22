export default function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={() => onClick(project.id)}
      className="cursor-pointer transition transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
      <p className="text-gray-300 text-sm opacity-90">{project.description || "No description"}</p>
    </div>
  );
}
