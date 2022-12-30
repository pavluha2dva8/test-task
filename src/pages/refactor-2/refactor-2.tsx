import { CenteredLayout } from '~/components/layouts';

// TODO refactor

interface QuestionOrAnswer {
  question?: string;
  answer?: string;
}

const QnA: QuestionOrAnswer[] = [
  { question: 'Do you run like a fish?' },
  { answer: 'Absolutely man' },
  { question: 'Have you tried to swim like a dinosaur?' },
  { answer: 'Nah, not my cup of tea' },
  { question: 'How are we counting from 5 to 10?' },
  { answer: 'Do I look like a counter?' },
];

const QnaRender = ({ question, answer }: QuestionOrAnswer) => {
  if (question) {
    return <h3 className="font-bold text-lg">{question}</h3>;
  } else {
    return <p className="mb-2">{answer}</p>;
  }
};

export const Refactor2 = () => {
  return (
    <CenteredLayout className="gap-2">
      <div className="text-3xl mb-2">See the code</div>
      {QnA.map((item, index) => (
        <QnaRender key={index} {...item} />
      ))}
    </CenteredLayout>
  );
};
