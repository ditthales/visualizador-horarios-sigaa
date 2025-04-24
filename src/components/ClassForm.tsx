import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Materia, Aula, DIAS_SEMANA } from '../types';

type Turno = 'M' | 'T' | 'N';
type DiaSigaa = '2' | '3' | '4' | '5' | '6' | '7';
type Horario = { inicio: string; fim: string };

const HORARIOS: Record<Turno, Record<number, Horario>> = {
  M: {
    1: { inicio: '06:00', fim: '06:50' },
    2: { inicio: '07:00', fim: '07:50' },
    3: { inicio: '08:00', fim: '08:50' },
    4: { inicio: '09:00', fim: '09:50' },
    5: { inicio: '10:00', fim: '10:50' },
    6: { inicio: '11:00', fim: '11:50' },
  },
  T: {
    1: { inicio: '12:00', fim: '12:50' },
    2: { inicio: '13:00', fim: '13:50' },
    3: { inicio: '14:00', fim: '14:50' },
    4: { inicio: '15:00', fim: '15:50' },
    5: { inicio: '16:00', fim: '16:50' },
    6: { inicio: '17:00', fim: '17:50' },
  },
  N: {
    1: { inicio: '18:00', fim: '18:50' },
    2: { inicio: '18:50', fim: '19:40' },
    3: { inicio: '19:40', fim: '20:30' },
    4: { inicio: '20:30', fim: '21:20' },
    5: { inicio: '21:20', fim: '22:10' },
    6: { inicio: '22:10', fim: '23:00' },
  },
};

const DIAS_SIGAA: Record<DiaSigaa, number> = {
  '2': 1, // Segunda
  '3': 2, // Terça
  '4': 3, // Quarta
  '5': 4, // Quinta
  '6': 5, // Sexta
  '7': 6, // Sábado
};

interface ClassFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (materia: Materia) => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ open, onClose, onSubmit }) => {
  const [materia, setMateria] = useState<Materia>({
    id: '',
    codigo: '',
    nome: '',
    cor: '#000000',
    aulas: [],
  });
  const [codigoSigaa, setCodigoSigaa] = useState('');

  const traduzirCodigoSigaa = (codigo: string) => {
    const aulas: Aula[] = [];
    const partes = codigo.split(' ');

    partes.forEach(parte => {
      const dia = parte[0] as DiaSigaa;
      const turno = parte[1] as Turno;
      const horarios = parte.slice(2);

      if (DIAS_SIGAA[dia] && HORARIOS[turno]) {
        horarios.split('').forEach(h => {
          const horario = HORARIOS[turno][Number(h)];
          if (horario) {
            aulas.push({
              id: Date.now().toString() + Math.random(),
              materiaId: materia.id,
              diaSemana: DIAS_SIGAA[dia],
              horarioInicio: horario.inicio,
              horarioFim: horario.fim,
            });
          }
        });
      }
    });

    return aulas;
  };

  const handleCodigoSigaaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigo = e.target.value.toUpperCase();
    setCodigoSigaa(codigo);
    
    if (codigo) {
      const novasAulas = traduzirCodigoSigaa(codigo);
      setMateria(prev => ({
        ...prev,
        aulas: novasAulas,
      }));
    }
  };

  const handleAddAula = () => {
    const novaAula: Aula = {
      id: Date.now().toString(),
      materiaId: materia.id,
      diaSemana: 1,
      horarioInicio: '08:00',
      horarioFim: '10:00',
    };
    setMateria((prev) => ({
      ...prev,
      aulas: [...prev.aulas, novaAula],
    }));
  };

  const handleRemoveAula = (aulaId: string) => {
    setMateria((prev) => ({
      ...prev,
      aulas: prev.aulas.filter((aula) => aula.id !== aulaId),
    }));
  };

  const handleAulaChange = (aulaId: string, field: keyof Aula, value: string | number) => {
    setMateria((prev) => ({
      ...prev,
      aulas: prev.aulas.map((aula) =>
        aula.id === aulaId ? { ...aula, [field]: value } : aula
      ),
    }));
  };

  const handleSubmit = () => {
    onSubmit(materia);
    setMateria({
      id: '',
      codigo: '',
      nome: '',
      cor: '#000000',
      aulas: [],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Adicionar Matéria</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid columns={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Código"
              value={materia.codigo}
              onChange={(e) => setMateria((prev) => ({ ...prev, codigo: e.target.value }))}
            />
          </Grid>
          <Grid columns={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nome"
              value={materia.nome}
              onChange={(e) => setMateria((prev) => ({ ...prev, nome: e.target.value }))}
            />
          </Grid>
          <Grid columns={{ xs: 12 }}>
            <TextField
              fullWidth
              type="color"
              label="Cor"
              value={materia.cor}
              onChange={(e) => setMateria((prev) => ({ ...prev, cor: e.target.value }))}
            />
          </Grid>
          <Grid columns={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Código SIGAA"
              value={codigoSigaa}
              onChange={handleCodigoSigaaChange}
              placeholder="Ex: 2N1 4N123"
              helperText="Digite o código do SIGAA para preencher automaticamente os horários"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aulas
          </Typography>
          {materia.aulas.map((aula) => (
            <Grid container spacing={2} key={aula.id} sx={{ mb: 2 }}>
              <Grid columns={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  select
                  label="Dia da Semana"
                  value={aula.diaSemana}
                  onChange={(e) => handleAulaChange(aula.id, 'diaSemana', Number(e.target.value))}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {DIAS_SEMANA.map((dia) => (
                    <option key={dia.value} value={dia.value}>
                      {dia.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid columns={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Início"
                  value={aula.horarioInicio}
                  onChange={(e) => handleAulaChange(aula.id, 'horarioInicio', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid columns={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Fim"
                  value={aula.horarioFim}
                  onChange={(e) => handleAulaChange(aula.id, 'horarioFim', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid columns={{ xs: 12, sm: 3 }}>
                <IconButton onClick={() => handleRemoveAula(aula.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={handleAddAula} sx={{ mt: 2 }}>
            Adicionar Aula
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassForm; 