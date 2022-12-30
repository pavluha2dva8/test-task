import { CenteredLayout } from '~/components/layouts';

interface QuestionAndAnswer {
  question: string;
  answer: string;
}

const QnA: QuestionAndAnswer[] = [
  { question: 'Do you run like a fish?', answer: 'Absolutely man' },
  { question: 'Have you tried to swim like a dinosaur?', answer: 'Nah, not my cup of tea' },
  { question: 'How are we counting from 5 to 10?', answer: 'Do I look like a counter?' },
];

const QnaRender = ({ question, answer }: QuestionAndAnswer) => {
  return (
    <>
      <h3 className="font-bold text-lg">{question}</h3>
      <p className="mb-2">{answer}</p>
    </>
  );
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
