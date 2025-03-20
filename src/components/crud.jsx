import React, { useState } from 'react';
import { tasks } from './data';
import DataGrid, { Column, Editing, Lookup, Popup, Paging, Pager, Form, Item, HeaderFilter, Toolbar } from 'devextreme-react/data-grid';
import "devextreme/dist/css/dx.material.blue.light.css";
import "./crud.css";
import SelectBox from 'devextreme-react/select-box';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

const priority = ["None", "Low", "Medium", "High", "Urgent"];
const statusOptions = ["All","Not started", "In Progress", "Completed"];


const priorityCellRender = (cellData) => {
    return <span className={`priority-${cellData.value.toLowerCase()}`}>{cellData.value}</span>;
};

const statusCellRender = (cellData) => {
    const status = cellData.value;
    let className = "";
    switch (status) {
        case "Not started":
            className = "status-not-started";
            break;
        case "In Progress":
            className = "status-in-progress";
            break;
        case "Completed":
            className = "status-completed";
            break;
        default:
            className = "";
    }
    return <span className={className}>{status}</span>;
};

export default function CrudTable() {
    const [view, setView] = useState("table");
    const [taskData, setTaskData] = useState(tasks);
    const [filterStatus, setFilterStatus] = useState(null);
    const [filterPriority, setFilterPriority] = useState(null);

    // 🔹 Function to Filter Data
   
    const filteredData = taskData.filter(task => 
        (!filterStatus || filterStatus === "All" || task.Status === filterStatus) &&
        (!filterPriority || filterPriority === "All" || task.Priority === filterPriority)
    );
    const onDragEnd = (result) => {
      if (!result.destination) return;

      const updatedTasks = [...taskData];
      const draggedItem = updatedTasks.find(task => task.ID.toString() === result.draggableId);
      if (draggedItem) {
          draggedItem.Priority = priority[result.destination.droppableId]; // Update priority instead of status
          setTaskData([...updatedTasks]);
      }
  };
    return (
        <div style={{ margin: '20px auto', borderRadius: '5px', backgroundColor: 'white', width: '98%', boxShadow: '0px 0px 5px 4px grey' }}>
            <div id='data-grid-demo' style={{ margin: 'auto', width: '93%' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2>Tasks</h2>
                        <p>Manage all tasks</p>                     
                    </div>
                    <div className='btn-container'>
                        <button  onClick={() => setView("table")} className={view === "table" ? "active-btn" : ""}><FaListUl style={{marginRight:"5px"}}/>List View</button>
                        <button onClick={() => setView("kanban")} className={view === "kanban" ? "active-btn" : ""}><IoGridOutline /> Kanban View</button>
                    </div>
                </div>

                {view === "table" ? (
                    <DataGrid 
                    searchPanel={{ visible: true, highlightCaseSensitive: true }}
                        dataSource={filteredData} 
                        keyExpr="ID" 
                        showBorders={true} 
                        // filterRow={{ visible: true }}
                        // headerFilter={{ visible: true }}
                        
                    >
                       
                        <Toolbar>
                            <Item style={{padding: "5px 25px" }}  name="searchPanel" location="before" />
                            

<Item location="before" name='filter' >
        <FiFilter style={{ marginLeft: "120px",marginTop:"18px", verticalAlign: "middle" }} />
        <SelectBox
            items={statusOptions}
            className='filter'
            placeholder="Filter by Status"
            value={filterStatus}
            onValueChanged={(e) => setFilterStatus(e.value)}
            style={{ width: "165px" ,marginTop:"-32px"}}
        />
    </Item>
        <Item location="before">
        <FiFilter style={{ marginLeft: "125px",marginTop:"18px", verticalAlign: "middle" }}/>
            <SelectBox
                items={priority}
                placeholder="Filter by Priority"
                value={filterPriority}
                onValueChanged={(e) => setFilterPriority(e.value)}
                style={{ width: "170px" ,marginTop:"-32px"}}
            />
        </Item>
        <Item name="addRowButton"  location="after" />
        
       
                        </Toolbar>

                        <Editing mode='popup' allowAdding allowDeleting allowUpdating>
                            <Popup title="Create Task" showTitle={true} width={600} height={400}>
                                <Form>
                                    <Item itemType="group" colCount={2} colSpan={2}>
                                        <Item dataField="Task" editorType="dxTextBox" />
                                        <Item dataField="Status" editorType="dxSelectBox" />
                                        <Item dataField="Priority" editorType="dxSelectBox" />
                                    </Item>
                                </Form>
                            </Popup>
                        </Editing>

                        <Column dataField='Task' caption='Task' />
                        <Column dataField='Status' caption='Status' cellRender={statusCellRender}>
                            <Lookup dataSource={statusOptions} />
                            <HeaderFilter allowSearch={true} />
                        </Column>
                        <Column dataField="Priority" caption="Priority" cellRender={priorityCellRender} width={125}>
                            <Lookup dataSource={priority} />
                            <HeaderFilter allowSearch={true} />
                        </Column>

                        <Paging defaultPageSize={12} />
                        <Pager visible={true} showPageSizeSelector={true} allowedPageSizes={[8, 12, 'all']} />
                    </DataGrid>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                  <div className="kanban-board">
                  {priority.map((prio, index) => (

                          <Droppable key={index} droppableId={index.toString()}>
                              {(provided) => (
                                  <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-column">
                                      {/* <h3>{prio}</h3> */}
                                      <h3>{prio} <button className='count'>{taskData.filter(task => task.Priority === prio).length}</button></h3>
                                      <div className='task'>

                                      {taskData
                                          .filter(task => task.Priority === prio) // Filter by Priority
                                          .map((task, idx) => (
                                              <Draggable key={task.ID.toString()} draggableId={task.ID.toString()} index={idx}>
                                                  {(provided) => (
                                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="kanban-task">
                                                          <p><strong>{task.Task}</strong></p>
                                                          <p> <span className={`status-${task.Status.toLowerCase().replace(/\s+/g, '-')}`} 
                    >
                    {task.Status}
                </span></p>
                                                      </div>
                                                  )}
                                              </Draggable>
                                          ))}
                                      </div>
                                      {provided.placeholder}
                                  </div>
                              )}
                          </Droppable>
                      ))}
                  </div>
              </DragDropContext>
                    
                )}
            </div>
        </div>
    );
}


