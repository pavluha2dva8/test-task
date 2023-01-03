export interface IAnnotation {
  id: number;
  author: string;
  comment: string;
  pos: {
    x: number;
    y: number;
  };
}

export const calPos = (pos: number) => pos * 100 + '%';

export const generateId = (annotations: IAnnotation[]) => {
  if (annotations.length) {
    return annotations[annotations.length - 1]['id'] + 1;
  }
  return 1;
};

export const nameInitials = (author: string) => {
  const [N, S] = author.toUpperCase().split(' ');
  if (S) {
    return N[0] + S[0];
  }
  return N[0];
};
