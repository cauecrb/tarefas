import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Container,
  Typography,
  Box,
} from '@mui/material';
import api from '../services/api';
import ColorPicker from '../components/ColorPicker';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false,
    is_favorite: false,
    color: '#e3f2fd'
  });

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await api.get(`/tasks/${id}`);
          const taskData = response.data.data;
          setFormData({
            ...taskData,
            due_date: taskData.due_date.slice(0, 16) // Formata para datetime-local
          });
        } catch (error) {
          console.error('Erro ao carregar tarefa:', error);
          navigate('/');
        }
      };
      fetchTask();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (id) {
            await api.put(`/tasks/${id}`, formData);
        } else {
            await api.post('/tasks', formData);
        }
        navigate('/');
    } catch (error) {
        console.error(error);
    }
};

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Tarefa' : 'Nova Tarefa'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <TextField
          label="Descrição"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <TextField
          label="Data Limite"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              />
            }
            label="Concluída"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_favorite}
                onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
              />
            }
            label="Favorita"
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Cor da Tarefa:
          </Typography>
          <ColorPicker
            color={formData.color}
            onChange={(newColor) => setFormData({ ...formData, color: newColor })}
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Salvar Tarefa
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default TaskForm;