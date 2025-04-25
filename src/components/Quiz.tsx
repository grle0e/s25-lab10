import React, { useState, useEffect } from 'react';
import './Quiz.css';
import QuizCore from '../core/QuizCore';

// undsen logic iig quizcore oos avna
let quiz = new QuizCore();

const Quiz: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); 
  const [submitted, setSubmitted] = useState(false); 
  const [update, setUpdate] = useState(0); 
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); 

  const currentQuestion = quiz.getCurrentQuestion(); 

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

    quiz.answerQuestion(option); 
    setSelectedAnswer(option); // UI-д сонгосон хариулт хадгалах
    setIsAnswerCorrect(option === currentQ.correctAnswer); // Зөв эсэхийг хадгалах
  };

  const handleNextClick = (): void => {
    if (selectedAnswer) {
      if (quiz.hasNextQuestion()) {
        quiz.nextQuestion(); 
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setUpdate(update + 1); // update UI
      } else {
        setSubmitted(true); // suuliin asuultad ocvol duussan
      }
    }
  };

  //omnoh asuult ru butsah
  const handleBackClick = (): void => {
    quiz.prevQuestion();
    setUpdate(update + 1); 
  };

  // restart
  const handleRestart = (): void => {
    quiz = new QuizCore(); 
    setSelectedAnswer(null);
    setSubmitted(false);
    setIsAnswerCorrect(null);
    setUpdate(update + 1); 
  };

  //asuult duussan esvel oldohgui bol
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
