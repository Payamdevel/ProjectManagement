
export const PROJECT_STATUS  = {
    PLANNING: "planning",
    ACTIVE: "active",
    COMPELETED: "compeleted",
    ON_HOLD: "on_hold",
};

export const TASK_STATUS = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    REVIEW: "review",
    DONE: "done",
};

export const TASK_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
};
export function createProject({
    id,
    name,
    description,
    status = PROJECT_STATUS.PLANNING,
    startDate,
    endDate,
}) {
    return{
        id,
        name, 
        description,
        status,
        startDate,
        endDate
    };
}

export function createTask({
  id,
  title,
  description,
  projectId,
  assigneeId,
  priority = TASK_PRIORITY.MEDIUM,
  status = TASK_STATUS.TODO,
  dueDate,
}) {
  return {
    id,
    title,
    description,
    projectId,
    assigneeId,
    priority,
    status,
    dueDate,
  };
}

export function createMember({
  id,
  name,
  jobTitle,
  avatar,
}) {
  return {
    id,
    name,
    jobTitle,
    avatar,
  };
}

export function createActivity({
  id,
  type,
  entityId,
  message,
  createdAt = new Date().toISOString(),
}) {
  return {
    id,
    type,
    entityId,
    message,
    createdAt,
  };
}