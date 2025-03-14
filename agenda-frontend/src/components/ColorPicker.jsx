import React from 'react';
import { CirclePicker } from 'react-color';
import { Popover, Button, IconButton } from '@mui/material';

const ColorPicker = ({ color, onChange, compact, icon }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const presetColors = [
    '#e3f2fd', // Azul claro
    '#fce4ec', // Rosa
    '#f0f4c3', // Verde claro
    '#ffebee', // Vermelho claro
    '#e8f5e9', // Verde
    '#fff3e0', // Laranja
    '#f3e5f5'  // Roxo
  ];

  return (
    <div>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        sx={{
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        {icon}
      </IconButton>
      
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <CirclePicker
          color={color}
          colors={presetColors}
          onChangeComplete={(color) => {
            onChange(color.hex);
            setAnchorEl(null);
          }}
        />
      </Popover>
    </div>
  );
};

export default ColorPicker;