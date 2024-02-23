import React, { useState, useEffect } from "react";
import { questions } from "../questions";

const Home = () => {
  const [state, setState] = useState({
    currentQuestion: 0,
    selectedOption: null,
    answers: [],
    quizFinished: false,
    visitedQuestions: [],
    canGoBack: true,
  });

  const [data, setData] = useState(questions);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && !state.quizFinished) {
        setTimeLeft(timeLeft - 1);
      } else if (
        state.currentQuestion < data.length - 1 &&
        !state.quizFinished
      ) {
        handleNext();
      } else {
        handleFinish();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, state, data]);

  useEffect(() => {
    changeSequence();
    setTimeLeft(20);
    setTimeExpired(false);
  }, [state.currentQuestion]);

  const changeSequence = () => {
    const newSequenence = [...questions].sort(() => Math.random() - 0.5);
    setData(newSequenence);
  };

  const handleOptionSelect = (option) => {
    if (!timeExpired) {
      setState({ ...state, selectedOption: option });
    }
  };

  const handleNext = () => {
    const { currentQuestion, selectedOption, answers } = state;
    const correctAnswer = data[currentQuestion].correctAnswer;
    const isAnswerCorrect = selectedOption === correctAnswer;

    setState({
      ...state,
      visitedQuestions: [...state.visitedQuestions, currentQuestion],
      answers: [
        ...answers,
        {
          question: data[currentQuestion].question,
          selectedOption,
          correct: isAnswerCorrect,
        },
      ],
      selectedOption: null,
      currentQuestion: currentQuestion + 1,
      quizFinished:
        currentQuestion === data.length - 1 ||
        currentQuestion === data.length - 1,
      canGoBack: true,
    });

    setTimeLeft(20);
    setTimeExpired(false);
  };

  const handlePrev = () => {
    if (!timeExpired) {
      setState({
        ...state,
        currentQuestion: state.currentQuestion - 1,
        canGoBack: false,
      });
    }
  };

  const handleFinish = () => {
    setState({
      ...state,
      quizFinished: true,
    });
  };

  const handleRestart = () => {
    setState({
      currentQuestion: 0,
      selectedOption: null,
      answers: [],
      quizFinished: false,
      visitedQuestions: [],
      canGoBack: true,
    });
    changeSequence();
    setTimeLeft(20);
    setTimeExpired(false);
  };

  const calculateResult = () => {
    const correctAnswers = state.answers.filter(
      (answer) => answer.correct
    ).length;
    return ((correctAnswers / data.length) * 100).toFixed(2);
  };

  const {
    currentQuestion,
    selectedOption,
    quizFinished,
    visitedQuestions,
    canGoBack,
  } = state;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <div className="mt-3">Question No: {state.currentQuestion + 1}</div>
            <div className="mt-3">
              <p>Time Left: {timeLeft} seconds</p>
              {timeExpired && <p>Time has expired for this question</p>}
            </div>
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-title">{data[currentQuestion].question}</h2>
          <ul className="list-group">
            {data[currentQuestion].options.map((option, index) => (
              <li key={index} className="list-group-item">
                <input
                  type="radio"
                  id={option}
                  name="options"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                />
                <label className="ml-2" htmlFor={option}>
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-primary mt-3 mr-2"
              onClick={handlePrev}
              disabled={
                !canGoBack ||
                currentQuestion === 0 ||
                visitedQuestions.includes(currentQuestion) ||
                timeExpired
              }
            >
              Prev
            </button>
            <button
              className="btn btn-primary mt-3"
              onClick={
                currentQuestion === data.length - 1 ? handleFinish : handleNext
              }
              disabled={!selectedOption || timeExpired}
            >
              {currentQuestion === data.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
          {quizFinished && (
            <div className="mt-3">
              <p>Result: {calculateResult()}%</p>
              <button className="btn btn-danger" onClick={handleRestart}>
                Restart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
