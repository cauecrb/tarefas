import React, { useState, useEffect } from 'react';
import { 
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Box,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Popover
} from '@mui/material';
import { 
  Star, 
  StarBorder, 
  Edit, 
  Delete, 
  Save, 
  Cancel,
  Search,
  FormatPaint
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { SketchPicker } from 'react-color';
import api from '../services/api';

const ColorPicker = ({ color, onChange, icon }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <div>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        sx={{
          '&:hover': {
            backgroundColor: '#00000010',
            transform: 'rotate(-15deg)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: 28,
            color: color === '#e3f2fd' ? '#616161' : color,
            ...icon.props.sx
          }
        })}
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <SketchPicker
          color={color}
          onChangeComplete={(color) => {
            onChange(color.hex);
            setAnchorEl(null);
          }}
        />
      </Popover>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [searchColor, setSearchColor] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    color: '#e3f2fd'
  });
  const [showCreateCard, setShowCreateCard] = useState(false);
  const uniqueColors = [...new Set(tasks
    .map(task => task.color?.toLowerCase())
    .filter(color => color && color !== '#e3f2fd')
  )];


  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data.data || []);
      } catch (err) {
        setError('Erro ao carregar tarefas');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Sorting and filtering
  const sortedTasks = [...tasks].sort((a, b) => b.is_favorite - a.is_favorite);
  const filteredTasks = sortedTasks.filter(task => {
    const taskColor = task.color?.toLowerCase() || '';
    const search = searchColor.toLowerCase();
    
    // Verifica se a busca corresponde a uma cor existente
    const isExactMatch = uniqueColors.includes(search);
    
    return isExactMatch 
      ? taskColor === search
      : taskColor.includes(search);
  });

  // Task operations
  const toggleFavorite = async (task) => {
    try {
      const updatedTask = await api.put(`/tasks/${task.id}`, {
        ...task,
        is_favorite: !task.is_favorite
      });
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask.data.data : t));
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      alert('Não foi possível excluir a tarefa');
    }
  };

  const updateTaskColor = async (taskId, newColor) => {
    try {
      await api.patch(`/tasks/${taskId}`, { color: newColor });
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, color: newColor } : t
      ));
    } catch (error) {
      console.error('Erro ao atualizar cor:', error);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditedTask({
      ...task,
      due_date: format(parseISO(task.due_date), "yyyy-MM-dd'T'HH:mm")
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTask({});
  };

  const saveChanges = async () => {
    try {
      const payload = {
        ...editedTask,
        due_date: new Date(editedTask.due_date).toISOString()
      };

      const updatedTask = await api.put(`/tasks/${editingId}`, payload);
      setTasks(prev => prev.map(task => 
        task.id === editingId ? updatedTask.data.data : task
      ));
      cancelEditing();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await api.post('/tasks', {
        ...newTask,
        due_date: new Date(newTask.due_date).toISOString()
      });
      
      setTasks([response.data.data, ...tasks]);
      setShowCreateCard(false);
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        color: '#e3f2fd'
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Filtrar por cor"
          value={searchColor}
          onChange={(e) => setSearchColor(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              height: 56
            }
          }}
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Create Task Card */}
        {showCreateCard ? (
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ 
              borderRadius: 3,
              border: '2px dashed #e0e0e0',
              backgroundColor: newTask.color,
              minHeight: 300
            }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  height: '100%'
                }}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descrição"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                  
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Prazo"
                    InputLabelProps={{ shrink: true }}
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    required
                  />
                  
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 'auto'
                  }}>
                    <ColorPicker
                      color={newTask.color}
                      onChange={(newColor) => setNewTask({...newTask, color: newColor})}
                      icon={<FormatPaint />}
                    />
                    
                    <Box>
                      <Button 
                        onClick={() => setShowCreateCard(false)}
                        sx={{ mr: 1 }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={handleCreateTask}
                        disabled={!newTask.title || !newTask.due_date}
                      >
                        Criar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              height: 300,
              border: '2px dashed #e0e0e0',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: '#64b5f6' }
            }} onClick={() => setShowCreateCard(true)}>
              <Typography variant="h6" color="textSecondary">
                + Nova Tarefa
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Tasks List */}
        {filteredTasks.map((task) => (
          <Grid item xs={12} md={4} key={task.id}>
            <Paper elevation={3} sx={{ 
              borderRadius: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: editingId === task.id ? editedTask.color : task.color,
                borderRadius: 2,
                border: `2px solid ${task.color ? `${task.color}80` : '#64b5f6'}`
              }}>
                <CardContent>
                  {editingId === task.id ? (
                    <>
                      <TextField
                        fullWidth
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                        margin="normal"
                        label="Título"
                        required
                      />
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                        margin="normal"
                        label="Descrição"
                      />
                      
                      <TextField
                        fullWidth
                        type="datetime-local"
                        value={editedTask.due_date}
                        onChange={(e) => setEditedTask({...editedTask, due_date: e.target.value})}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <Box sx={{ 
                        borderBottom: '2px solid #e0e0e0',
                        marginX: -3,
                        paddingX: 3,
                        paddingBottom: 2,
                        marginBottom: 2
                      }}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {task.title}
                          </Typography>
                          <Chip 
                            label={task.completed ? 'Concluída' : 'Pendente'} 
                            sx={{ 
                              backgroundColor: task.completed ? '#81c784' : '#ffb74d',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <IconButton 
                            onClick={() => toggleFavorite(task)}
                            sx={{ color: task.is_favorite ? '#ffd700' : 'inherit' }}
                          >
                          {task.is_favorite ? <Star /> : <StarBorder />}
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          minHeight: 80,
                          mb: 3,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {task.description || 'Sem descrição'}
                      </Typography>
                      
                      <Box sx={{ 
                        marginTop: 'auto',
                        paddingTop: 2,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.12)'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          🕒 {format(parseISO(task.due_date), 'dd/MM/yyyy HH:mm')}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>

                <CardActions sx={{ 
                  justifyContent: 'space-between',
                  p: 2,
                  borderTop: `1px solid ${task.color ? `${task.color}50` : '#64b5f650'}`
                }}>
                  <Box display="flex" gap={1}>
                    {editingId === task.id ? (
                      <>
                        <IconButton onClick={saveChanges} color="primary">
                          <Save />
                        </IconButton>
                        <IconButton onClick={cancelEditing} color="error">
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => startEditing(task)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(task.id)} color="error">
                          <Delete />
                        </IconButton>
                      </>
                    )}

                    <Box display="flex" gap={1} alignItems="center">
                      <ColorPicker
                        color={editingId === task.id ? editedTask.color : task.color}
                        onChange={(newColor) => {
                          if (editingId === task.id) {
                            setEditedTask({...editedTask, color: newColor});
                          } else {
                            updateTaskColor(task.id, newColor);
                          }
                        }}
                        compact
                        icon={<FormatPaint />}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" gap={1} alignItems="center">
                    <ColorPicker
                      color={editingId === task.id ? editedTask.color : task.color}
                      onChange={(newColor) => {
                        if (editingId === task.id) {
                          setEditedTask({...editedTask, color: newColor});
                        } else {
                          const updateTaskColor = async () => {
                            try {
                              await api.patch(`/tasks/${task.id}`, { color: newColor });
                              setTasks(prev => prev.map(t => 
                                t.id === task.id ? { ...t, color: newColor } : t
                              ));
                            } catch (error) {
                              console.error('Erro ao atualizar cor:', error);
                            }
                          };
                          updateTaskColor();
                        }
                      }}
                      icon={<FormatPaint />}
                    />
                  </Box>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TaskList;