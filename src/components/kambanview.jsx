import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./kamban.css"; // Add styles

const initialTasks = {
  none: [
    { id: "1", content: "Database performance issues", status: "Completed" },
    { id: "2", content: "Configure analytics tracking", status: "In Progress" },
  ],
  low: [
    { id: "3", content: "Prepare monthly report", status: "In Progress" },
    { id: "4", content: "Fix login page bug", status: "Not Started" },
  ],
  medium: [
    { id: "5", content: "Update API documentation", status: "Completed" },
    { id: "6", content: "Refactor user authentication", status: "Completed" },
  ],
  high: [
    { id: "7", content: "Write project roadmap", status: "In Progress" },
    { id: "8", content: "Draft feature roadmap", status: "Completed" },
  ],
  urgent: [
    { id: "9", content: "Review PR #543", status: "Completed" },
    { id: "10", content: "Incident task: node failure", status: "Completed" },
  ],
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const sourceTasks = [...tasks[sourceColumn]];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destinationTasks = [...tasks[destinationColumn]];
    destinationTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destinationColumn]: destinationTasks,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {Object.entries(tasks).map(([columnId, columnTasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{columnId.toUpperCase()}</h3>
                {columnTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="kanban-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {task.content}
                        <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
