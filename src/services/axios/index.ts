import axios from 'axios';
import { IAnnotation } from '~/pages/annotations/utils';

export const getAnnotations = async () => {
  try {
    const { data } = await axios.get<IAnnotation[]>('http://localhost:3000/annotations');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('error message: ', error.message);
    } else {
      console.error('unexpected error: ', error);
    }
  }
};

export const addAnnotation = async (annotation: IAnnotation) => {
  try {
    await axios.post('http://localhost:3000/annotations', annotation);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('error message: ', error.message);
    } else {
      console.error('unexpected error: ', error);
    }
  }
};

export const deleteAnnotation = async (id: number) => {
  try {
    await axios.delete(`http://localhost:3000/annotations/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('error message: ', error.message);
    } else {
      console.error('unexpected error: ', error);
    }
  }
};
