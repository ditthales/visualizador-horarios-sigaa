import React, { useState, useRef, useEffect } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography, Button, Stack } from '@mui/material'
import WeeklySchedule from './components/WeeklySchedule'
import ClassForm from './components/ClassForm'
import { Materia } from './types'

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Salvar no localStorage sempre que as matérias mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
  }, [materias]);

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
                onClick={handleExport}
              >
                Exportar Grade
              </Button>
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImport}
              />
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                Importar Grade
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleClearStorage}
              >
                Limpar Dados
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
      </Box>
    </ThemeProvider>
  )
}

export default App
