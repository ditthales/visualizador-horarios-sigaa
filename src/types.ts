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
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
]; 