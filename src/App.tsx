import React, { useState, useRef, useEffect } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography, Button, Stack, Snackbar, Alert } from '@mui/material'
import WeeklySchedule from './components/WeeklySchedule'
import ClassForm from './components/ClassForm'
import { Materia } from './types'
import { encodeGradeData, decodeGradeData } from './utils/urlEncoder'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          maxWidth: '100% !important',
        },
      },
    },
  },
});

const STORAGE_KEY = 'grade-horaria';

const App: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Salvar no localStorage sempre que as matérias mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
  }, [materias]);

  // Carregar dados do localStorage ou da URL
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setMaterias(JSON.parse(savedData));
    }

    // Verificar se há dados na URL
    const path = window.location.pathname;
    if (path.length > 1) {
      const encodedData = path.substring(1);
      const decodedMaterias = decodeGradeData(encodedData);
      if (decodedMaterias.length > 0) {
        setMaterias(decodedMaterias);
      }
    }
  }, []);

  const handleAddMateria = (novaMateria: Omit<Materia, 'id'>) => {
    const materiaComId = {
      ...novaMateria,
      id: Date.now().toString(),
    };
    setMaterias([...materias, materiaComId]);
    setIsFormOpen(false);
  };

  const handleRemoveMateria = (materiaId: string) => {
    setMaterias(materias.filter(materia => materia.id !== materiaId));
  };

  const handleExport = () => {
    const data = JSON.stringify(materias, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grade-horaria.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setMaterias(data);
          // O useEffect vai salvar automaticamente no localStorage
        } catch (error) {
          alert('Erro ao importar o arquivo. Verifique se o formato está correto.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearStorage = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados salvos?')) {
      localStorage.removeItem(STORAGE_KEY);
      setMaterias([]);
    }
  };

  const handleShare = () => {
    if (materias.length === 0) {
      setSnackbar({
        open: true,
        message: 'Adicione matérias antes de compartilhar',
        severity: 'error'
      });
      return;
    }

    const encodedData = encodeGradeData(materias);
    const url = `${window.location.origin}/${encodedData}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setSnackbar({
        open: true,
        message: 'Link copiado para a área de transferência!',
        severity: 'success'
      });
    }).catch(() => {
      setSnackbar({
        open: true,
        message: 'Erro ao copiar link',
        severity: 'error'
      });
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'grey.50',
          overflow: 'hidden',
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            flex: 1,
            py: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '100%',
            padding: 0,
          }}
        >
          <Box sx={{ width: '100%', height: '100%', p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Calendário de Aulas
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setIsFormOpen(true)}
              >
                Adicionar Matéria
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleShare}
              >
                Compartilhar
              </Button>
            </Stack>
            <WeeklySchedule 
              materias={materias} 
              onRemoveMateria={handleRemoveMateria}
            />
            <ClassForm
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSubmit={handleAddMateria}
            />
          </Box>
        </Container>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default App
