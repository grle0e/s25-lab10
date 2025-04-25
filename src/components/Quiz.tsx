import React, { useState, useEffect } from 'react';
import './Quiz.css';
import QuizCore from '../core/QuizCore';

// undsen logic iig quizcore oos avna
let quiz = new QuizCore();

const Quiz: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // Хэрэглэгчийн сонгосон хариулт
  const [submitted, setSubmitted] = useState(false); // Асуулт бүр дууссан эсэх
  const [update, setUpdate] = useState(0); // UI шинэчлэхэд ашиглагддаг
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // Сонгосон хариулт зөв эсэх

  const currentQuestion = quiz.getCurrentQuestion(); 

  // UI шинэчлэх бүрт сонгосон хариултыг сэргээнэ
  useEffect(() => {
    const savedAnswer = quiz.getSelectedAnswer();
    const currentQ = quiz.getCurrentQuestion();

    setSelectedAnswer(savedAnswer);
    if (savedAnswer && currentQ) {
      setIsAnswerCorrect(savedAnswer === currentQ.correctAnswer);
    } else {
      setIsAnswerCorrect(null);
    }
  }, [update]);

  const handleOptionSelect = (option: string): void => {
    if (selectedAnswer) return; 
    const currentQ = quiz.getCurrentQuestion();
    if (!currentQ) return;

    quiz.answerQuestion(option); // Логикт оноог бүртгэнэ
    setSelectedAnswer(option); // UI-д сонгосон хариулт хадгалах
    setIsAnswerCorrect(option === currentQ.correctAnswer); // Зөв эсэхийг хадгалах
  };

  const handleNextClick = (): void => {
    if (selectedAnswer) {
      if (quiz.hasNextQuestion()) {
        quiz.nextQuestion(); 
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setUpdate(update + 1); // UI-г шинэчлэх
      } else {
        setSubmitted(true); // Сүүлийн асуултад хүрсэн бол дууссан гэж тэмдэглэнэ
      }
    }
  };

  // Өмнөх асуулт руу буцах
  const handleBackClick = (): void => {
    quiz.prevQuestion();
    setUpdate(update + 1); // UI-г шинэчлэх
  };

  // Шинээр эхлүүлэх товч дарсны дараа бүх төлөвийг дахин тохируулна
  const handleRestart = (): void => {
    quiz = new QuizCore(); 
    setSelectedAnswer(null);
    setSubmitted(false);
    setIsAnswerCorrect(null);
    setUpdate(update + 1); // UI-г дахин шинэчилнэ
  };

  // Хэрэв асуулт дууссан эсвэл олдохгүй бол
  if (submitted || !currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {quiz.getScore()} out of {quiz.getTotalQuestions()}</p>
        <button onClick={handleRestart} style={{ marginTop: '20px' }}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={`${selectedAnswer === option ? 'selected' : ''} ${selectedAnswer ? 'disabled' : ''}`}
            style={{ cursor: selectedAnswer ? 'not-allowed' : 'pointer' }}
          >
            {option}
          </li>
        ))}
      </ul>

      {/* Хэрэглэгчийн сонгосон хариулт зөв/буруу эсэхийг харуулна */}
      {selectedAnswer && isAnswerCorrect !== null && (
        <p style={{ color: isAnswerCorrect ? 'green' : 'red' }}>
          {isAnswerCorrect ? 'Зөв хариулт!' : 'Буруу хариулт.'}
        </p>
      )}

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      {/* next bolon back buttons */}
      <div style={{ marginTop: '20px' }}>
        {quiz.getCurrentIndex() > 0 && (
          <button onClick={handleBackClick}>Back</button>
        )}
        <button
          onClick={handleNextClick}
          disabled={!selectedAnswer}
          style={{ marginLeft: '10px' }}
        >
          {quiz.hasNextQuestion() ? 'Next Question' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
