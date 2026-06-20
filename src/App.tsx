import { useState, useMemo } from 'react';
import './App.css';
import data from './data/questions.json';

type Category = {
  id: string;
  name: string;
  description: string;
  topics: string[];
};

type Question = {
  id: number;
  categoryId: string;
  question: string;
  answer: string;
  isMastered: boolean;
};

function App() {
  const [activeCategory, setActiveCategory] = useState<string>('frontend');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());

  // Filter questions by active category
  const currentQuestions = useMemo(() => {
    return data.questions.filter((q) => q.categoryId === activeCategory);
  }, [activeCategory]);

  const currentQuestion = currentQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150); // slight delay to allow unflip
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  const toggleMastered = () => {
    setMasteredIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
        // Automatically go to next question after marking as mastered
        setTimeout(() => handleNext(), 400);
      }
      return newSet;
    });
  };

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progressPercentage = ((currentIndex + 1) / currentQuestions.length) * 100;
  
  // Calculate global stats
  const totalMastered = masteredIds.size;
  const totalQuestions = data.questions.length;
  const currentCategoryMastered = currentQuestions.filter(q => masteredIds.has(q.id)).length;

  return (
    <div className="app-container">
      <header>
        <h1>Interview Prep: Full Stack Engineer</h1>
        <p>Master the core concepts for your upcoming interview.</p>
      </header>

      <main className="main-content">
        <div className="categories">
          {data.categories.map((cat: Category) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => selectCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="glass flashcard-container">
          {currentQuestion && (
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-front">
                <div className="card-label">Question {currentIndex + 1} of {currentQuestions.length}</div>
                <div className="card-content">{currentQuestion.question}</div>
                <div className="flip-hint">Click to reveal answer</div>
              </div>
              <div className="flashcard-back">
                <div className="card-label">Answer</div>
                <div className="card-content">{currentQuestion.answer}</div>
                <div className="flip-hint">Click to see question</div>
              </div>
            </div>
          )}
        </div>

        <div className="controls">
          <button 
            className="btn btn-prev" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
          >
            &larr; Previous
          </button>
          
          <button 
            className={`btn ${masteredIds.has(currentQuestion?.id) ? 'btn-review' : 'btn-mastered'}`}
            onClick={toggleMastered}
          >
            {masteredIds.has(currentQuestion?.id) ? 'Mark for Review' : 'Mark as Mastered ✓'}
          </button>
          
          <button 
            className="btn btn-next" 
            onClick={handleNext} 
            disabled={currentIndex === currentQuestions.length - 1}
          >
            Next &rarr;
          </button>
        </div>

        <div className="glass stats">
          <div className="stat-box">
            <div className="stat-value">{currentCategoryMastered} / {currentQuestions.length}</div>
            <div className="stat-label">Category Mastered</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{totalMastered} / {totalQuestions}</div>
            <div className="stat-label">Total Progress</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
