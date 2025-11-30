export interface Exercise {
  id: string;
  type: 'fill-in-blank' | 'word-bank' | 'multiple-choice';
  question: string;
  prompt?: string; // For audio or display text
  correctAnswer: string[];
  wordBank: string[];
  hint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  exercises: Exercise[];
}

export const lessons: Record<string, Lesson> = {
  'lesson-1': {
    id: 'lesson-1',
    title: 'React Components Basics',
    description: 'Learn how to create your first React component',
    xpReward: 10,
    exercises: [
      {
        id: 'ex-1-1',
        type: 'word-bank',
        question: 'Complete the function component',
        prompt: 'function Welcome() { }',
        correctAnswer: ['return', '<div>', 'Hello', '</div>'],
        wordBank: ['return', '<div>', '<span>', 'Hello', '</div>', 'render', 'const'],
        hint: 'Components must return JSX'
      },
      {
        id: 'ex-1-2',
        type: 'word-bank',
        question: 'Import React in a component file',
        correctAnswer: ['import', 'React', 'from', 'react'],
        wordBank: ['import', 'React', 'from', 'react', 'require', 'export', 'default'],
        hint: 'Use ES6 import syntax'
      },
      {
        id: 'ex-1-3',
        type: 'word-bank',
        question: 'Export a component',
        correctAnswer: ['export', 'default', 'Welcome'],
        wordBank: ['export', 'default', 'Welcome', 'import', 'function', 'const', 'module'],
        hint: 'Use default export'
      }
    ]
  },
  'lesson-2': {
    id: 'lesson-2',
    title: 'JSX Fundamentals',
    description: 'Understand JSX syntax and expressions',
    xpReward: 10,
    exercises: [
      {
        id: 'ex-2-1',
        type: 'word-bank',
        question: 'Embed JavaScript expression in JSX',
        prompt: 'const name = "React"',
        correctAnswer: ['<h1>', '{name}', '</h1>'],
        wordBank: ['<h1>', '{name}', '</h1>', '(name)', '${name}', '<div>', '"name"'],
        hint: 'Use curly braces for expressions'
      },
      {
        id: 'ex-2-2',
        type: 'word-bank',
        question: 'JSX must have a single parent element',
        correctAnswer: ['<div>', '<h1>', 'Title', '</h1>', '<p>', 'Text', '</p>', '</div>'],
        wordBank: ['<div>', '<h1>', 'Title', '</h1>', '<p>', 'Text', '</p>', '</div>', '<>', '</>'],
        hint: 'Wrap multiple elements in a parent'
      }
    ]
  },
  'lesson-3': {
    id: 'lesson-3',
    title: 'Props and Data Flow',
    description: 'Pass data between components using props',
    xpReward: 10,
    exercises: [
      {
        id: 'ex-3-1',
        type: 'word-bank',
        question: 'Define props in a function component',
        correctAnswer: ['function', 'Greeting', '({', 'name', '})'],
        wordBank: ['function', 'Greeting', '({', 'name', '})', 'props', 'this', 'state'],
        hint: 'Use destructuring for props'
      },
      {
        id: 'ex-3-2',
        type: 'word-bank',
        question: 'Pass props to a component',
        correctAnswer: ['<Greeting', 'name=', '"Alice"', '/>'],
        wordBank: ['<Greeting', 'name=', '"Alice"', '/>', 'props=', '{name}', 'value='],
        hint: 'Use attribute syntax in JSX'
      }
    ]
  },
  'practice-1': {
    id: 'practice-1',
    title: 'Practice: React Basics Review',
    description: 'Review what you learned in Unit 1',
    xpReward: 15,
    exercises: [
      {
        id: 'ex-p1-1',
        type: 'word-bank',
        question: 'Create a complete React component',
        correctAnswer: ['function', 'App', '()', '{', 'return', '<h1>', 'Hello', '</h1>', '}'],
        wordBank: ['function', 'App', '()', '{', 'return', '<h1>', 'Hello', '</h1>', '}', 'class', 'render', 'const'],
        hint: 'Combine component declaration and JSX return'
      },
      {
        id: 'ex-p1-2',
        type: 'word-bank',
        question: 'Use props with JSX expression',
        correctAnswer: ['<div>', '{props.message}', '</div>'],
        wordBank: ['<div>', '{props.message}', '</div>', '(props.message)', 'props.message', '${props.message}'],
        hint: 'Access props with dot notation inside curly braces'
      }
    ]
  },
  'lesson-4': {
    id: 'lesson-4',
    title: 'useState Hook',
    description: 'Manage state in functional components',
    xpReward: 10,
    exercises: [
      {
        id: 'ex-4-1',
        type: 'word-bank',
        question: 'Import useState hook',
        correctAnswer: ['import', '{', 'useState', '}', 'from', 'react'],
        wordBank: ['import', '{', 'useState', '}', 'from', 'react', 'React', 'default'],
        hint: 'Named import from react'
      },
      {
        id: 'ex-4-2',
        type: 'word-bank',
        question: 'Declare state with useState',
        correctAnswer: ['const', '[count,', 'setCount]', '=', 'useState(0)'],
        wordBank: ['const', '[count,', 'setCount]', '=', 'useState(0)', 'let', 'var', 'this.state'],
        hint: 'Array destructuring for state and setter'
      }
    ]
  },
  'lesson-5': {
    id: 'lesson-5',
    title: 'Event Handling',
    description: 'Handle user interactions in React',
    xpReward: 10,
    exercises: [
      {
        id: 'ex-5-1',
        type: 'word-bank',
        question: 'Add onClick handler',
        correctAnswer: ['<button', 'onClick={handleClick}', '>', 'Click', '</button>'],
        wordBank: ['<button', 'onClick={handleClick}', '>', 'Click', '</button>', 'onclick=', 'on-click=', 'click='],
        hint: 'Use camelCase for event handlers'
      },
      {
        id: 'ex-5-2',
        type: 'word-bank',
        question: 'Update state on click',
        correctAnswer: ['setCount(count', '+', '1)'],
        wordBank: ['setCount(count', '+', '1)', 'count++', 'count', '=', 'setState'],
        hint: 'Call the setter function with new value'
      }
    ]
  }
};
