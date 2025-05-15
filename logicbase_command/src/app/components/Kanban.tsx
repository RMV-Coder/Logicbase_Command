'use client';

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  Box,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CardActions,
} from '@mui/material';
import { Divider, Segmented } from 'antd';
// import dayjs from 'dayjs';

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanState {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

const initialData: KanbanState = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Initial Project Meeting' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1'],
    },
  },
  columnOrder: ['column-1'],
};
interface Project {
    project_id: number;
    project_name: string;
    project_details: string;
    project_due: string;
    project_status: string;
    project_config: {
      project_type: string;
      start_date: string;
    };
  }
interface KanbanBoardProps {
    project: Project;
    projectId: number;
    statusChange: (status: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({project, projectId, statusChange}) => {
    console.log("Current project:" , project)
    const [kanbanData, setKanbanData] = useState(initialData);
    const [openDialog, setOpenDialog] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [newTaskContent, setNewTaskContent] = useState('');
    const [currentTaskContent, setCurrentTaskContent] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [selectedTask, setSelectedTask] = useState<string>('');
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>(project.project_status);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    useEffect(() => {
        if (project?.project_status && project.project_status !== status) {
          setStatus(project.project_status);
        }
      }, [project.project_status]);
    const saveKanbanData = async (updatedData: KanbanState) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/kanban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanban: JSON.stringify({ kanbanData: updatedData }) }),
      });
      const data = await response.json();
      if(!response.ok){
        setSnackbarMessage(data.error)
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        throw new Error('Failed to update Kanban data');
      }
    } catch (error) {
      console.error('Error updating Kanban data:', error);
    }
  };
  
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = kanbanData.columns[source.droppableId];
    const finish = kanbanData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setKanbanData((prev) => {
        const updated = {
        ...prev,
        columns: {
          ...prev.columns,
          [newColumn.id]: newColumn,
        },
      }
      saveKanbanData(updated);
      return updated;
    });
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      setKanbanData((prev) => {
        const updated ={
        ...prev,
        columns: {
          ...prev.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      }
      saveKanbanData(updated);
      return updated;
    });
    }
  };
  const editTask = (taskId: string, newContent: string) => {
    setKanbanData((prev) => {
    const updated ={
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { ...prev.tasks[taskId], content: newContent },
      },
    }
    saveKanbanData(updated);
    return updated;
    });
  };
  const deleteTask = (taskId: string) => {
    setKanbanData((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
  
      const newColumns = { ...prev.columns };
      for (const columnId in newColumns) {
        newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(
          (id) => id !== taskId
        );
      }
      const updated = {
        ...prev,
        tasks: newTasks,
        columns: newColumns,
      };
      saveKanbanData(updated);
      return updated;
    });
  };

const addTask = () => {
  if (!newTaskContent.trim()) return;

  const newTaskId = `task-${Date.now()}`;
  const newTask = { id: newTaskId, content: newTaskContent };

  setKanbanData((prev) => {
    const column = prev.columns['column-1'];
    const updated = {
      ...prev,
      tasks: { ...prev.tasks, [newTaskId]: newTask },
      columns: {
        ...prev.columns,
        [column.id]: {
          ...column,
          taskIds: [...column.taskIds, newTaskId],
        },
      },
    };
    saveKanbanData(updated);
    return updated;
  });
  setNewTaskContent('');
};
  const handleAddColumn = () => {
    setDialogTitle('Add New Column');
    const newColumnId = `column-${Date.now()}`;
    setKanbanData((prev) => {
        const updated = {
        ...prev,
        columns: {
            ...prev.columns,
            [newColumnId]: {
                id: newColumnId,
                title: newColumnTitle,
                taskIds: [],
            },
        },
        columnOrder: [...prev.columnOrder, newColumnId],
    }
    saveKanbanData(updated);
    return updated;
    });
    setNewColumnTitle('');
    setOpenDialog(false);
  };
  const handleEditColumn = (columnId: string, newTitle: string) => {
    setKanbanData((prev) => {
    const updated = {
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          title: newTitle,
        },
      },
    }
    saveKanbanData(updated);
    return updated;
    });
  }
  useEffect(() => {
    const fetchKanbanData = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/kanban`);
        const data = await response.json();
        if(!response.ok){
            setSnackbarMessage(data.error)
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            throw new Error(data.error);
        }
        console.log("Data fetched: ", data.kanban);
        // const config = JSON.parse(data.kanban);
        // console.log('Fetched Kanban data:', config.kanbanData);
        setKanbanData(data.kanban || initialData);
      } catch (error) {
        console.error('Error fetching Kanban data:', error);
      }
    };
    fetchKanbanData();
  }, [projectId]);
  useEffect(() => {
      if(status){
        const updateStatus = async () => {
          try {
            const response = await fetch(`/api/projects/${projectId}/kanban`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if(!response.ok){
                setSnackbarMessage(data.error)
                setSnackbarSeverity('error');
                throw new Error (data.error);
            }
            setSnackbarMessage(data.message);
            setSnackbarSeverity('success');
            
          } catch (error) {
            console.error('Error updating Kanban data:', error);
          } finally{
            setSnackbarOpen(true);
          }
        }
        updateStatus();
        statusChange(status);
      }
  }, [status])
//   useEffect(() => {
//     if (isFirstLoad.current) {
//         isFirstLoad.current = false;
//         return; // ⛔ Skip first update (likely initialData)
//       }
//     const updateKanbanData = async () => {
//       try {
//         await fetch(`/api/projects/${projectId}/kanban`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ kanban: JSON.stringify({ kanbanData }) }),
//         });
//       } catch (error) {
//         console.error('Error updating Kanban data:', error);
//       }
//     };
  
//     updateKanbanData();
//   }, [kanbanData, projectId]);
  
  return (
    <>
    <Box sx={{ display: 'flex', overflowX: 'auto', p: 2 }}>
        {/* <Divider/> */}
        <Box sx={{ minWidth: 400, mx: 1, backgroundColor: '#f0f0f0', borderRadius: 2, p: 1, flexDirection: 'column', display:'flex' }}>{/* MOVE THIS TO A DRAGGABLE CONTEXT*/}
            {/* <div className="mt-4"> */}
                {/* <input
                    type="text"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="New task Content"
                    className="border px-2 py-1 rounded w-full"
                /> */}
                {/* <Typography variant="h6">Project Name: {project.project_name}</Typography>
                <Typography variant="body1">Start: {dayjs(project.project_config.start_date).format('MMMM D, YYYY')}</Typography>
                <Typography variant="body1">Due: {dayjs(project.project_due).format('MMMM D, YYYY')}</Typography>
                <Typography variant="body1">Details: {project.project_details}</Typography>
                <Typography variant="body1">Status: {<Chip variant={'filled'} size={'small'} color={project.project_status === 'Completed' ? 'success' : project.project_status === 'Planned' ? 'info':project.project_status === 'On going' ? 'primary':project.project_status === 'Planning' ? 'secondary':project.project_status === 'Past Due' ? 'error':'warning'} label={project.project_status}/>}</Typography>*/}
                <Typography sx={{p:2}} variant="body1">Status:{<Segmented options={['To be Discussed','On going','Past Due','Completed']} value={status} onChange={setStatus}/>}</Typography>
                <Divider/> 
                <TextField
                    autoFocus
                    margin="dense"
                    label="New Task Content"
                    // fullWidth
                    size="small"
                    variant="outlined"
                    value={newTaskContent}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                />
                <Button onClick={addTask} sx={{ minWidth: 200, mx: 1 }}>
                    Add Task
                </Button>
                <Divider/>
                {/* New Tasks will be added here */}
            {/* </div> */}
        </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        {kanbanData.columnOrder.map((columnId) => {
          const column = kanbanData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => kanbanData.tasks[taskId]);

          return (
            <Box
              key={column.id}
              sx={{ minWidth: 300, mx: 1, backgroundColor: '#f0f0f0', borderRadius: 2, p: 1 }}
            >
              <Typography variant="h6">{column.title}</Typography>
              <Button 
                size="small" 
                onClick={() => {
                    setDialogTitle('Edit Column');
                    setNewColumnTitle(column.title);
                    setSelectedColumnId(column.id);
                    setOpenDialog(true);
                }}
                >
                Edit
                </Button>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 100, p: 1 }}
                  >
                    {tasks.map((task, index) => (
                      <Draggable draggableId={task.id} index={index} key={task.id}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 1, maxWidth:'275px' }}
                          >
                            <CardContent>
                              <Typography>{task.content}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => {
                                    setDialogTitle('Edit Task');
                                    setOpenDialog(true);
                                    setCurrentTaskContent(task.content);
                                    setSelectedTask(task.id);
                                    }}>Edit</Button>
                                <Button onClick={() => deleteTask(task.id)}>Delete</Button>
                            </CardActions>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          );
        })}
        {/* + Add Column Button */}
        <Box sx={{ minWidth: 200, mx: 1 }}>
            <Button
                variant="outlined"
                onClick={() => {
                    setDialogTitle('Add New Column');
                    setOpenDialog(true)
                }}
                sx={{ height: '100%' }}
            >
                + Add Column
            </Button>
        </Box>
      </DragDropContext>

      {/* Add Column Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {dialogTitle === 'Add New Column' ? <TextField
            autoFocus
            margin="dense"
            label="Column Title"
            fullWidth
            variant="outlined"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />: dialogTitle === 'Edit Column' ? <TextField
            autoFocus
            margin="dense"
            label="Column Title"
            fullWidth
            variant="outlined"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />: dialogTitle === 'Edit Task' ? <TextField
            autoFocus
            margin="dense"
            label="Task Content"
            fullWidth
            variant="outlined"
            value={currentTaskContent}
            onChange={(e) => setCurrentTaskContent(e.target.value)}
          />: null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {dialogTitle === 'Add New Column' && <Button onClick={handleAddColumn} variant="contained" disabled={newColumnTitle===''}>Add</Button>}
          {dialogTitle === 'Edit Column' && <Button onClick={()=>{
            handleEditColumn(selectedColumnId as string, newColumnTitle)
            setOpenDialog(false)}} variant="contained">Save</Button>}
          {dialogTitle === 'Edit Task' && <Button onClick={()=>{
            editTask(selectedTask, currentTaskContent)
            setOpenDialog(false)
            }} variant="contained">Save</Button>}
        </DialogActions>
      </Dialog>
    </Box>
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
        </Alert>
    </Snackbar>
    </>
  );
}

export default KanbanBoard;