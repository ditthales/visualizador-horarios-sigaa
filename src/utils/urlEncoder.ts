import { Materia } from '../types';
import LZString from 'lz-string';

export const encodeGradeData = (materias: Materia[]): string => {
  try {
    const data = JSON.stringify(materias);
    const compressed = LZString.compressToEncodedURIComponent(data);
    return compressed;
  } catch (error) {
    console.error('Erro ao codificar dados:', error);
    return '';
  }
};

export const decodeGradeData = (encodedData: string): Materia[] => {
  try {
    if (!encodedData) {
      throw new Error('Dados vazios');
    }

    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!decompressed) {
      throw new Error('Falha na descompressão dos dados');
    }

    const parsedData = JSON.parse(decompressed);
    if (!Array.isArray(parsedData)) {
      throw new Error('Dados inválidos: não é um array');
    }

    return parsedData;
  } catch (error) {
    console.error('Erro ao decodificar dados da grade:', error);
    return [];
  }
}; 