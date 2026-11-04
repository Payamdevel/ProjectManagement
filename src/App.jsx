import { projects, tasks, members, activities } from "./data/seedData";
import {
  getProjectProgress,
  getProjectTasks,
  getMemberById,
} from "./data/projectRules";
import "./App.css"

function App() {
  return (
    <div>
      <h1>Project Management Dashboard</h1>

      <h2>Projects</h2>

      {projects.map((project) => {
        const projectTasks = getProjectTasks(
          project.id,
          tasks
        );

        const progress = getProjectProgress(
          project.id,
          tasks
        );

        return (
          <div key={project.id}>
            <h3>{project.name}</h3>

            <p>{project.description}</p>

            <p>Status: {project.status}</p>

            <p>Progress: {progress}%</p>

            <p>Tasks: {projectTasks.length}</p>
          </div>
        );
      })}

      <h2>All Tasks</h2>

      {tasks.map((task) => {
        const member = getMemberById(
          task.assigneeId,
          members
        );

        return (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Assigned to: {member?.name ?? "Unassigned"}</p>
          </div>
        );
      })}

      <h2>Recent Activities</h2>

      {activities.map((activity) => (
        <p key={activity.id}>
          {activity.message}
        </p>
      ))}
    </div>
  );
}

export default App;