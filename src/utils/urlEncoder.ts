import { Materia } from '../types';
import LZString from 'lz-string';

export const encodeGradeData = (materias: Materia[]): string => {
  const data = JSON.stringify(materias);
  return LZString.compressToEncodedURIComponent(data);
};

export const decodeGradeData = (encodedData: string): Materia[] => {
  try {
    const decodedData = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!decodedData) {
      throw new Error('Dados inválidos');
    }
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Erro ao decodificar dados da grade:', error);
    return [];
  }
}; 