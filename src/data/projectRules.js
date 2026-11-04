import { TASK_STATUS } from "./models";

export function getProjectTasks(projectId, tasks){
    return tasks.filter(
        (task) => task.projectId === projectId
    );
}

export function getMemberTasks(memberId, tasks){
    return tasks.filter(
        (task) => task.assigneeId === memberId
    );
}

export function getProjectProgress(projectId, tasks){
    const projectTasks = getProjectTasks(projectId, tasks);

    if(projectTasks.length === 0){
        return 0;
    }

    const completedTasks = projectTasks.filter(
        (task) => task.status === TASK_STATUS.DONE
    );

    return Math.round(
        (completedTasks.length / projectTasks.length) * 100
    );
}

export function getMemberById(memberId, members){
    return members.find(
        (member) => member.id === memberId
    );
}

export function isValidTask(task, project, members) {
    const projectExists = projects.some(
        (project) => project.id === task.projectId
    );

    const memberExists = members.some(
        (member) => member.id === task.assigneeId
    );

    return projectExists && memberExists;
}



