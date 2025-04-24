export interface Aula {
  id: string;
  materiaId: string;
  diaSemana: number;
  horarioInicio: string;
  horarioFim: string;
}

export interface Materia {
  id: string;
  codigo: string;
  nome: string;
  cor: string;
  aulas: Aula[];
}

export const DIAS_SEMANA = [
  { value: 0, label: 'Segunda-feira' },
  { value: 1, label: 'Terça-feira' },
  { value: 2, label: 'Quarta-feira' },
  { value: 3, label: 'Quinta-feira' },
  { value: 4, label: 'Sexta-feira' },
  { value: 5, label: 'Sábado' },
] as const;

export const CORES = [
  { value: '#2196f3', label: 'Azul' },
  { value: '#4caf50', label: 'Verde' },
  { value: '#f44336', label: 'Vermelho' },
  { value: '#ff9800', label: 'Laranja' },
  { value: '#9c27b0', label: 'Roxo' },
  { value: '#607d8b', label: 'Cinza' },
] as const; 