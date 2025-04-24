import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Materia, Aula, DIAS_SEMANA } from '../types';

interface WeeklyScheduleProps {
  materias: Materia[];
  onRemoveMateria: (materiaId: string) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 até 23:00

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ materias, onRemoveMateria }) => {
  const calculatePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - 6) * 12 + Math.floor(minutes / 5);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 200px)',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '80px repeat(6, minmax(150px, 1fr))',
          gridTemplateRows: '50px repeat(204, 1fr)',
          gap: 1,
          minWidth: '1100px',
        }}
      >
        {/* Cabeçalho */}
        <Box sx={{ 
          gridColumn: '1', 
          gridRow: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '2px solid',
          borderColor: 'divider',
        }} />
        {DIAS_SEMANA.map((day, index) => (
          <Box
            key={day.value}
            sx={{
              gridColumn: `${index + 2}`,
              gridRow: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: { xs: '0.8rem', sm: '1rem' },
              borderBottom: '2px solid',
              borderColor: 'divider',
              p: 1,
              textAlign: 'center',
              wordBreak: 'break-word',
              minWidth: '150px',
            }}
          >
            {day.label}
          </Box>
        ))}

        {/* Horas */}
        {HOURS.map((hour) => (
          <React.Fragment key={hour}>
            <Box
              sx={{
                gridColumn: '1',
                gridRow: `${(hour - 6) * 12 + 2} / span 12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                borderRight: '2px solid',
                borderColor: 'divider',
                p: 1,
              }}
            >
              {hour}:00
            </Box>
            {DIAS_SEMANA.map((_, dayIndex) => (
              <Box
                key={`${hour}-${dayIndex}`}
                sx={{
                  gridColumn: `${dayIndex + 2}`,
                  gridRow: `${(hour - 6) * 12 + 2} / span 12`,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Aulas */}
        {materias.map((materia) =>
          materia.aulas.map((aula) => {
            const startPosition = calculatePosition(aula.horarioInicio);
            const endPosition = calculatePosition(aula.horarioFim);
            const duration = endPosition - startPosition;

            return (
              <Box
                key={`${materia.id}-${aula.id}`}
                sx={{
                  gridColumn: `${aula.diaSemana + 2}`,
                  gridRow: `${startPosition + 2} / span ${duration}`,
                  bgcolor: materia.cor,
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3,
                    zIndex: 1,
                  },
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  gap: 1,
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    }}
                  >
                    {materia.codigo}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveMateria(materia.id)}
                    sx={{ 
                      color: 'white', 
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {materia.nome}
                </Typography>
                <Typography 
                  variant="caption"
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.75rem' },
                    opacity: 0.9,
                  }}
                >
                  {aula.horarioInicio} - {aula.horarioFim}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default WeeklySchedule; 