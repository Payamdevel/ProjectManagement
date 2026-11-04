
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  projects as seedProjects,
  tasks as seedTasks,
  members as seedMembers,
  activities as seedActivities,
} from "../data/seedData";

// Use fresh copies so changes don't modify the original seed data.
const getInitialData = () => ({
  projects: structuredClone(seedProjects),
  tasks: structuredClone(seedTasks),
  members: structuredClone(seedMembers),
  activities: structuredClone(seedActivities),
});

const createId = () => crypto.randomUUID();

const createActivity = (type, message, extra = {}) => ({
  id: createId(),
  type,
  message,
  createdAt: new Date().toISOString(),
  ...extra,
});

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // Application data
      ...getInitialData(),

      // -------------------------
      // PROJECT ACTIONS
      // -------------------------

      createProject: (projectData) => {
        const project = {
          id: createId(),
          status: "planning",
          createdAt: new Date().toISOString(),
          ...projectData,
        };

        set((state) => ({
          projects: [...state.projects, project],
          activities: [
            createActivity(
              "project_created",
              `Created project: ${project.name}`,
              { projectId: project.id }
            ),
            ...state.activities,
          ],
        }));

        return project.id;
      },

      updateProject: (projectId, updates) => {
        const existing = get().projects.find(
          (project) => project.id === projectId
        );

        if (!existing) return;

        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { ...project, ...updates, id: projectId }
              : project
          ),
          activities: [
            createActivity(
              "project_updated",
              `Updated project: ${existing.name}`,
              { projectId }
            ),
            ...state.activities,
          ],
        }));
      },

      deleteProject: (projectId) => {
        const project = get().projects.find(
          (item) => item.id === projectId
        );

        if (!project) return;

        set((state) => ({
          projects: state.projects.filter(
            (item) => item.id !== projectId
          ),
          // Delete the project's tasks too.
          tasks: state.tasks.filter(
            (task) => task.projectId !== projectId
          ),
          activities: [
            createActivity(
              "project_deleted",
              `Deleted project: ${project.name}`,
              { projectId }
            ),
            ...state.activities,
          ],
        }));
      },

      // -------------------------
      // TASK ACTIONS
      // -------------------------

      createTask: (taskData) => {
        const task = {
          id: createId(),
          status: "todo",
          priority: "medium",
          createdAt: new Date().toISOString(),
          ...taskData,
        };

        set((state) => ({
          tasks: [...state.tasks, task],
          activities: [
            createActivity(
              "task_created",
              `Created task: ${task.title}`,
              {
                projectId: task.projectId,
                taskId: task.id,
              }
            ),
            ...state.activities,
          ],
        }));

        return task.id;
      },

      updateTask: (taskId, updates) => {
        const existing = get().tasks.find(
          (task) => task.id === taskId
        );

        if (!existing) return;

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, id: taskId }
              : task
          ),
          activities: [
            createActivity(
              "task_updated",
              `Updated task: ${existing.title}`,
              {
                projectId: existing.projectId,
                taskId,
              }
            ),
            ...state.activities,
          ],
        }));
      },

      deleteTask: (taskId) => {
        const task = get().tasks.find(
          (item) => item.id === taskId
        );

        if (!task) return;

        set((state) => ({
          tasks: state.tasks.filter(
            (item) => item.id !== taskId
          ),
          activities: [
            createActivity(
              "task_deleted",
              `Deleted task: ${task.title}`,
              {
                projectId: task.projectId,
                taskId,
              }
            ),
            ...state.activities,
          ],
        }));
      },

      assignTask: (taskId, memberId) => {
        const task = get().tasks.find(
          (item) => item.id === taskId
        );

        if (!task) return;

        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === taskId
              ? { ...item, assigneeId: memberId }
              : item
          ),
          activities: [
            createActivity(
              "task_assigned",
              `Changed assignee for: ${task.title}`,
              {
                projectId: task.projectId,
                taskId,
              }
            ),
            ...state.activities,
          ],
        }));
      },

      changeTaskStatus: (taskId, newStatus) => {
        const task = get().tasks.find(
          (item) => item.id === taskId
        );

        if (!task || task.status === newStatus) return;

        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === taskId
              ? { ...item, status: newStatus }
              : item
          ),
          activities: [
            createActivity(
              "task_status_changed",
              `Changed status of "${task.title}" to ${newStatus}`,
              {
                projectId: task.projectId,
                taskId,
              }
            ),
            ...state.activities,
          ],
        }));
      },

      // -------------------------
      // RESET DEMO DATA
      // -------------------------

      resetDemoData: () => {
        set(getInitialData());
      },
    }),
    {
      name: "project-management-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),

      // Only save business data, not temporary UI state.
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        members: state.members,
        activities: state.activities,
      }),

      // If stored data has an older version, start with valid seed data.
      migrate: () => getInitialData(),

      // Validate restored data and use seed data if it is invalid.
      merge: (persistedState, currentState) => {
        const valid =
          persistedState &&
          Array.isArray(persistedState.projects) &&
          Array.isArray(persistedState.tasks) &&
          Array.isArray(persistedState.members) &&
          Array.isArray(persistedState.activities);

        return {
          ...currentState,
          ...(valid ? persistedState : getInitialData()),
        };
      },
    }
  )
);
