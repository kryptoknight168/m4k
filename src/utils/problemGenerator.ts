// Types
export type Operation = '+' | '-' | '×' | '÷';

export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface Settings {
  grade: number;
  operations: {
    addition: boolean;
    subtraction: boolean;
    multiplication: boolean;
    division: boolean;
  };
  numberOfProblems: number;
  timerSeconds: number;
}

// Helper Functions
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getEnabledOperations = (settings: Settings): Operation[] => {
  const operations: Operation[] = [];
  if (settings.operations.addition) operations.push('+');
  if (settings.operations.subtraction) operations.push('-');
  if (settings.operations.multiplication) operations.push('×');
  if (settings.operations.division) operations.push('÷');
  return operations;
};

// Problem generators based on grade level
const generateAdditionProblem = (grade: number): Pick<Problem, 'num1' | 'num2'> => {
  switch (grade) {
    case 4:
      return {
        num1: getRandomInt(1, 100),
        num2: getRandomInt(1, 100),
      };
    case 5:
      return {
        num1: getRandomInt(10, 500),
        num2: getRandomInt(10, 500),
      };
    case 6:
      return {
        num1: getRandomInt(50, 999),
        num2: getRandomInt(50, 999),
      };
    case 7:
    case 8:
      return {
        num1: getRandomInt(100, 999),
        num2: getRandomInt(100, 999),
      };
    default:
      return {
        num1: getRandomInt(1, 20),
        num2: getRandomInt(1, 20),
      };
  }
};

const generateSubtractionProblem = (grade: number): Pick<Problem, 'num1' | 'num2'> => {
  // Allow negative answers by not enforcing num1 >= num2
  const addition = generateAdditionProblem(grade);
  return { 
    num1: addition.num1, 
    num2: addition.num2 
  };
};

const generateMultiplicationProblem = (grade: number): Pick<Problem, 'num1' | 'num2'> => {
  switch (grade) {
    case 4:
      return {
        num1: getRandomInt(1, 10),
        num2: getRandomInt(1, 10),
      };
    case 5:
      return {
        num1: getRandomInt(2, 12),
        num2: getRandomInt(2, 12),
      };
    case 6:
      return {
        num1: getRandomInt(3, 15),
        num2: getRandomInt(3, 15),
      };
    case 7:
      return {
        num1: getRandomInt(5, 20),
        num2: getRandomInt(5, 20),
      };
    case 8:
      return {
        num1: getRandomInt(10, 25),
        num2: getRandomInt(10, 20),
      };
    default:
      return {
        num1: getRandomInt(1, 10),
        num2: getRandomInt(1, 10),
      };
  }
};

const generateDivisionProblem = (grade: number): Pick<Problem, 'num1' | 'num2'> => {
  // For division, generate a multiplication problem first to ensure clean division
  const { num1: multiplier, num2: multiplicand } = generateMultiplicationProblem(grade);
  const dividend = multiplier * multiplicand;
  
  return {
    num1: dividend,    // This will be the dividend
    num2: multiplier,  // This will be the divisor
  };
};

// Main function to generate a single problem
export const generateProblem = (settings: Settings, previousOperation?: Operation): Problem => {
  // Get available operations based on settings
  const operations = getEnabledOperations(settings);
  
  if (operations.length === 0) {
    // Fallback to addition if no operations are selected
    operations.push('+');
  }

  // Select operation randomly from enabled operations
  const randomIndex = Math.floor(Math.random() * operations.length);
  const operation = operations[randomIndex];

  // Generate problem based on operation and grade
  let problemData: Pick<Problem, 'num1' | 'num2'>;
  switch (operation) {
    case '+':
      problemData = generateAdditionProblem(settings.grade);
      break;
    case '-':
      problemData = generateSubtractionProblem(settings.grade);
      break;
    case '×':
      problemData = generateMultiplicationProblem(settings.grade);
      break;
    case '÷':
      problemData = generateDivisionProblem(settings.grade);
      break;
    default:
      problemData = generateAdditionProblem(settings.grade);
  }
  
  // Calculate answer
  let answer: number;
  switch (operation) {
    case '+':
      answer = Math.round(problemData.num1 + problemData.num2);
      break;
    case '-':
      answer = Math.round(problemData.num1 - problemData.num2);
      break;
    case '×':
      answer = Math.round(problemData.num1 * problemData.num2);
      break;
    case '÷':
      answer = Math.round(problemData.num1 / problemData.num2);
      break;
    default:
      answer = 0;
  }
  
  return {
    num1: Math.round(problemData.num1),
    num2: Math.round(problemData.num2),
    operation,
    answer,
  };
};

// Generate a set of problems based on settings
export const generateProblems = (settings: Settings): Problem[] => {
  const problems: Problem[] = [];
  let previousOperation: Operation | undefined = undefined;
  
  for (let i = 0; i < settings.numberOfProblems; i++) {
    const problem = generateProblem(settings, previousOperation);
    problems.push(problem);
    previousOperation = problem.operation;
  }
  
  return problems;
};

// Function to increase the difficulty for next problem
export const getIncreasedDifficulty = (settings: Settings): Settings => {
  // Clone the settings to avoid mutating the original
  const newSettings = { ...settings };
  
  // Increase grade level if possible
  if (settings.grade < 8) {
    newSettings.grade += 1;
  }
  
  return newSettings;
};

// Function to decrease the difficulty for next problem
export const getDecreasedDifficulty = (settings: Settings): Settings => {
  // Clone the settings to avoid mutating the original
  const newSettings = { ...settings };
  
  // Decrease grade level if possible
  if (settings.grade > 4) {
    newSettings.grade -= 1;
  }
  
  return newSettings;
}; 