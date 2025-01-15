const questions = [
  {
      question: "Which of the following is used to define a block of code in Python?",
      options: ["A. Parentheses", "B. Curly braces", "C. Indentation", "D. Square brackets"],
      correct: "C. Indentation"
  },
  {
      question: "Which of the following data types is immutable in Python?",
      options: ["A. List", "B. Dictionary", "C. Set", "D. Tuple"],
      correct: "D. Tuple"
  },
  {
      question: "Which of the following is a correct syntax to create a dictionary in Python?",
      options: ["A. my_dict = {key: value}", "B. my_dict = [key: value]", "C. my_dict = (key: value)", "D. my_dict = <key: value>"],
      correct: "A. my_dict = {key: value}"
  },
  {
      question: "What is the correct syntax to declare an array in C++?",
      options: ["A. int array[10];", "B. array int[10];", "C. int array;", "D. array[10] int;"],
      correct: "A. int array[10];"
  },
  {
      question: "Which of the following is used to allocate memory dynamically in C++?",
      options: ["A. malloc", "B. new", "C. alloc", "D. memory"],
      correct: "B. new"
  },
  {
      question: "Which of the following correctly declares a constant in C++?",
      options: ["A. const int PI = 3.14;", "B. constant int PI = 3.14;", "C. int const PI = 3.14;", "D. int constant PI = 3.14;"],
      correct: "A. const int PI = 3.14;"
  },
  {
      question: "Which of the following is not a primitive data type in Java?",
      options: ["A. int", "B. float", "C. char", "D. String"],
      correct: "D. String"
  },
  {
      question: "Which of the following is not a principle of Object-Oriented Programming?",
      options: ["A. Encapsulation", "B. Polymorphism", "C. Abstraction", "D. Compilation"],
      correct: "D. Compilation"
  },
  {
      question: "In OOP, which concept allows a class to be derived from more than one base class?",
      options: ["A. Inheritance", "B. Polymorphism", "C. Encapsulation", "D. Multiple Inheritance"],
      correct: "D. Multiple Inheritance"
  },
  {
      question: "Which of the following best describes the concept of encapsulation?",
      options: ["A. Hiding the internal state and requiring all interaction to be performed through an object's methods", "B. Allowing a class to be derived from another class", "C. Providing a way to create abstract classes and methods", "D. Allowing multiple classes to have the same method names but different implementations"],
      correct: "A. Hiding the internal state and requiring all interaction to be performed through an object's methods"
  }
];

let currentQuestionIndex = 0;
let taskCounter = 0;
let puzzleCounter = 0;
let selectedIconClass = '';

function showPopup(text, iconClass) {
  const optionsContainer = document.getElementById('question-options');
  const submitButton = document.getElementById('submit-btn');
  const resultMessage = document.getElementById('result-message');
  const questionContainer = document.querySelector('.question-container h3');

  if (iconClass === 'fa-question-circle') {
      const question = questions[currentQuestionIndex];
      questionContainer.style.display = 'block';
      document.getElementById('popup-text').innerText = question.question;
      displayQuestion();
      submitButton.style.display = 'block';
      optionsContainer.style.display = 'block';
  } else if (iconClass === 'fa-pencil') {
      taskCounter++;
      if (taskCounter > 10) {
          taskCounter = 1;
      }
      questionContainer.style.display = 'none';
      document.getElementById('popup-text').innerText = `TASK ${taskCounter}`;
      submitButton.style.display = 'none';
      optionsContainer.style.display = 'none';
      resultMessage.innerText = '';
      selectIcon(iconClass);
  } else if (iconClass === 'fa-puzzle-piece') {
      puzzleCounter++;
      if (puzzleCounter > 10) {
          puzzleCounter = 1;
      }
      questionContainer.style.display = 'none';
      document.getElementById('popup-text').innerText = `PUZZLE ${puzzleCounter}`;
      submitButton.style.display = 'none';
      optionsContainer.style.display = 'none';
      resultMessage.innerText = '';
      selectIcon(iconClass);
  }
  document.getElementById('popup').style.display = 'block';
  selectedIconClass = iconClass;
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('popup-text').innerText = question.question; // Ensure question text is displayed
  const optionsContainer = document.getElementById('question-options');
  optionsContainer.innerHTML = '';
  question.options.forEach(option => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'option';
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      optionsContainer.appendChild(label);
  });
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('result-message').innerText = '';
}

function removeLife() {
  const livesContainer = document.querySelector('.team-info p span.material-symbols-outlined');
  if (livesContainer) {
      livesContainer.remove();
  }
}

function showLostLifePopup() {
    const lostLifePopup = document.createElement('div');
    lostLifePopup.className = 'lost-life-popup';
    lostLifePopup.innerHTML = `
        <p>YOU LOST A LIFE!!</p>
    `;
    document.body.appendChild(lostLifePopup);
    setTimeout(() => {
        lostLifePopup.remove();
        closePopup(); // Close the question popup at the same time
    }, 2500); // Show popup for 3.5 seconds
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const resultMessage = document.getElementById('result-message');
        if (selectedOption.value === questions[currentQuestionIndex].correct) {
            resultMessage.innerText = 'Correct';
            resultMessage.style.color = 'green';
            setTimeout(() => {
                closePopup();
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    displayQuestion();
                }
                if (selectedIconClass) {
                    selectIcon(selectedIconClass);
                    selectedIconClass = '';
                }
            }, 1000);
        } else {
            resultMessage.innerText = 'Incorrect';
            resultMessage.style.color = 'red';
            removeLife(); // Remove a life icon when the answer is incorrect
            showLostLifePopup(); // Show lost life popup
        }
    }
}

function selectIcon(iconClass) {
  const selectedIconsContainer = document.getElementById('selected-icons');
  const iconElement = document.createElement('i');
  iconElement.className = `fa ${iconClass}`;
  selectedIconsContainer.appendChild(iconElement);
}

function removeLastIcon() {
  const selectedIconsContainer = document.getElementById('selected-icons');
  if (selectedIconsContainer.lastChild) {
      selectedIconsContainer.removeChild(selectedIconsContainer.lastChild);
  }
}

document.getElementById('question-options').addEventListener('change', checkAnswer);
