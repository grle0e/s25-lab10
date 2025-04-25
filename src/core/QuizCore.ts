import quizData from '../data/quizData';
import QuizQuestion from './QuizQuestion';

/**
 * quiz-iin logic iig udirddag
 */
class QuizCore {
  private questions: QuizQuestion[];                
  private currentQuestionIndex: number;             
  private score: number;                           
  private selectedAnswers: (string | null)[];       

  constructor() {
    this.questions = quizData;
    this.currentQuestionIndex = 0;
    this.score = 0;

    this.selectedAnswers = new Array(quizData.length).fill(null);
  }

  public getCurrentQuestion(): QuizQuestion | null {
    if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    }
    return null;
  }

  //next
  public nextQuestion(): void {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
    }
  }

  //back
  public prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  public hasNextQuestion(): boolean {
    return this.currentQuestionIndex < this.questions.length - 1;
  }

  public answerQuestion(answer: string): void {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      const alreadyAnswered = this.selectedAnswers[this.currentQuestionIndex];

      if (!alreadyAnswered && answer === currentQuestion.correctAnswer) {
        this.score++;
      }
      if (alreadyAnswered && alreadyAnswered === currentQuestion.correctAnswer && answer !== currentQuestion.correctAnswer) {
        this.score--;
      }
      this.selectedAnswers[this.currentQuestionIndex] = answer;
    }
  }

  public getSelectedAnswer(): string | null {
    return this.selectedAnswers[this.currentQuestionIndex];
  }

  public getScore(): number {
    return this.score;
  }

  public getTotalQuestions(): number {
    return this.questions.length;
  }

  public getCurrentIndex(): number {
    return this.currentQuestionIndex;
  }
}

export default QuizCore;
