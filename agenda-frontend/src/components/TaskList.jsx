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
  Search
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import FormatPaintIcon from '@mui/icons-material/FormatColorFill';
import { SketchPicker } from 'react-color';
import api from '../services/api';
import ColorPicker from '../components/ColorPicker';
import colorName from 'color-name';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [searchColor, setSearchColor] = useState('');
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [colorName, getColorName] = useState('');

  const uniqueColors = [...new Set(tasks
    .map(task => task.color)
    .filter(color => color && color !== '#e3f2fd')
  )];

  // Ordenação: favoritas primeiro, depois por data
  const sortedTasks = [...tasks].sort((a, b) => {
    if (b.is_favorite !== a.is_favorite) return b.is_favorite - a.is_favorite;
    return new Date(a.due_date) - new Date(b.due_date);
  });

  const filteredTasks = tasks
  .sort((a, b) => b.is_favorite - a.is_favorite)
  .filter(task => 
    task.color?.toLowerCase().includes(searchColor.toLowerCase())
  );


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data.data || []);
      } catch (err) {
        setError('Erro ao carregar tarefas. Tente novamente mais tarde.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleFavorite = async (task) => {
    try {
      const updatedTask = await api.put(`/tasks/${task.id}`, {
        ...task,
        is_favorite: !task.is_favorite
      });
      setTasks(prev => prev.map(t => 
        t.id === task.id ? updatedTask.data.data : t
      ));
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
      title: task.title,
      description: task.description,
      completed: task.completed,
      is_favorite: task.is_favorite,
      color: task.color || '#e3f2fd',
      date: task.due_date
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTask({});
  };

  const saveChanges = async () => {
    try {
      const dueDate = new Date(editedTask.due_date);
    if (isNaN(dueDate)) {
      alert('Data inválida');
      return;
    }
    const payload = {
      title: editedTask.title,
      description: editedTask.description,
      due_date: editedTask.date,
      completed: editedTask.completed,
      is_favorite: editedTask.is_favorite,
      color: editedTask.color
    };

      const response = await api.put(`/tasks/${editingId}`, payload);

      if (response.status === 200) {
        setTasks(prev => 
          prev.map(task => 
            task.id === editingId ? response.data.data : task
          )
        );
        cancelEditing();
      }
    } catch (error) {
      console.error('Erro detalhado:', {
        request: error.config?.data,
        response: error.response?.data
      });
      alert(`Erro ao salvar: ${error || 'Erro desconhecido'}`);
    }
  };

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    color: '#e3f2fd'
  });
  const [showCreateCard, setShowCreateCard] = useState(false);

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
    <div style={{ padding: '60px' }}>
      <Box display="flex" justifyContent="space-between" mb={3} gap={3}><br>
      </br>
          <Box sx={{flexGrow: 1, 
          display: 'flex',
          gap: 1,
          width: '100%',
          maxWidth: { md: 'calc(100% - 200px)' }
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
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                   <Button
                    onClick={(e) => setColorPickerAnchor(e.currentTarget)}
                    sx={{ minWidth: 40, height: 40 }}
                  >
                  {<FormatPaintIcon sx={{ color: '#616161' }} />}
                  </Button>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: 56
                }
              }}
            />
            
            <Popover
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
          >
            <SketchPicker
              presetColors={uniqueColors}
              color={searchColor}
              onChangeComplete={(color) => {
                setSearchColor(color.hex);
                setColorPickerAnchor(null);
              }}
            />
          </Popover>

            {selectedColor && (
              <Typography variant="caption" sx={{ 
                position: 'absolute',
                bottom: -20,
                left: 50,
                color: 'text.secondary'
              }}>
                {getColorName(selectedColor)}
              </Typography>
            )}
            
          <Button 
            variant="contained" 
            color="primary"
            href="/new"
          >
            Nova Tarefa
          </Button>
        </Box>
      </Box>

      <Grid container spacing={6}>
        {filteredTasks?.length > 0 ? (
          filteredTasks.map((task) => (
            <Grid item xs={12} md={4} key={task.id} sx={{padding: '24px'}}>
              <Paper elevation={3} sx={{ 
                borderRadius: 6,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
                margin: '16px'
              }}>
               <Card sx={{ 
                  height: '100%',
                  minHeight: { xs: 300, md: 400 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: editingId === task.id ? editedTask.color : task.color,
                  borderRadius: 2,
                  border: `2px solid ${task.color ? `${task.color}80` : '#64b5f6'}`,
                  transition: 'all 0.3s ease'
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
                        <Box display="flex" justifyContent="space-between" mb={2} sx={{
                          borderBottom: '2px solid #e0e0e0', 
                          marginX: '-16px',
                          paddingX: '16px',
                          paddingBottom: 2, 
                          marginBottom: 2
                        }}>
                          <Typography variant="h10" sx={{ fontWeight: 'bold' }}>
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
                        
                        <Box sx={{ 
                          marginTop: 'auto',
                          paddingTop: 2,
                        }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            minHeight: '160px',
                            mb: 2,
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {task.description || 'Sem descrição'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          <strong> 🕒 Prazo:</strong> {format(parseISO(task.due_date), 'dd/MM/yyyy HH:mm')}
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
                    </Box>

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
                        icon={<FormatPaintIcon sx={{ color: '#616161' }} />}
                      />
                    </Box>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box p={3} textAlign="center">
              <Typography variant="body1" color="textSecondary">
                Nenhuma tarefa cadastrada
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default TaskList;