import { Materia } from '../types';

export const encodeGradeData = (materias: Materia[]): string => {
  const data = JSON.stringify(materias);
  return encodeURIComponent(data);
};

export const decodeGradeData = (encodedData: string): Materia[] => {
  try {
    const decodedData = decodeURIComponent(encodedData);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Erro ao decodificar dados da grade:', error);
    return [];
  }
}; 