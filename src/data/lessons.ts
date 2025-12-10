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
  },
  'lesson-6': {
    id: 'lesson-6',
    title: 'useEffect Hook',
    description: 'Handle side effects in React',
    xpReward: 15,
    exercises: [
      {
        id: 'ex-6-1',
        type: 'word-bank',
        question: 'Import useEffect hook',
        correctAnswer: ['import', '{', 'useState,', 'useEffect', '}', 'from', 'react'],
        wordBank: ['import', '{', 'useState,', 'useEffect', '}', 'from', 'react', 'useeffect', 'effect'],
        hint: 'Named import alongside useState'
      },
      {
        id: 'ex-6-2',
        type: 'word-bank',
        question: 'Run effect on mount',
        correctAnswer: ['useEffect(()=>{', 'fetchData()', '},', '[]', ')'],
        wordBank: ['useEffect(()=>{', 'fetchData()', '},', '[]', ')', '[data]', 'useEffect'],
        hint: 'Empty dependency array runs once on mount'
      }
    ]
  },
  'lesson-7': {
    id: 'lesson-7',
    title: 'Conditional Rendering',
    description: 'Show components conditionally',
    xpReward: 10,
    exercises: [
      {
        id: 'ex-7-1',
        type: 'word-bank',
        question: 'Render with ternary operator',
        correctAnswer: ['{isLoggedIn', '?', '<Dashboard/>', ':', '<Login/>}'],
        wordBank: ['{isLoggedIn', '?', '<Dashboard/>', ':', '<Login/>}', 'if', 'else', '&&'],
        hint: 'Use ternary for if-else in JSX'
      }
    ]
  },
  'lesson-8': {
    id: 'lesson-8',
    title: 'Lists and Keys',
    description: 'Render lists in React',
    xpReward: 15,
    exercises: [
      {
        id: 'ex-8-1',
        type: 'word-bank',
        question: 'Map array to JSX elements',
        correctAnswer: ['{items.map(item', '=>', '<li', 'key={item.id}', '>{item.name}</li>)}'],
        wordBank: ['{items.map(item', '=>', '<li', 'key={item.id}', '>{item.name}</li>)}', 'key=', 'id=', 'forEach'],
        hint: 'Always add key prop to list items'
      }
    ]
  },
  'lesson-9': {
    id: 'lesson-9',
    title: 'Forms and Inputs',
    description: 'Handle form inputs in React',
    xpReward: 15,
    exercises: [
      {
        id: 'ex-9-1',
        type: 'word-bank',
        question: 'Controlled input component',
        correctAnswer: ['<input', 'value={name}', 'onChange={handleChange}', '/>'],
        wordBank: ['<input', 'value={name}', 'onChange={handleChange}', '/>', 'onchange=', 'defaultValue='],
        hint: 'Use value and onChange for controlled inputs'
      }
    ]
  },
  'lesson-10': {
    id: 'lesson-10',
    title: 'Lifting State Up',
    description: 'Share state between components',
    xpReward: 20,
    exercises: [
      {
        id: 'ex-10-1',
        type: 'word-bank',
        question: 'Pass state setter as prop',
        correctAnswer: ['<Child', 'value={count}', 'onChange={setCount}', '/>'],
        wordBank: ['<Child', 'value={count}', 'onChange={setCount}', '/>', 'state=', 'setState='],
        hint: 'Pass both value and setter to child'
      }
    ]
  },
  'lesson-11': {
    id: 'lesson-11',
    title: 'Context API',
    description: 'Share data across component tree',
    xpReward: 25,
    exercises: [
      {
        id: 'ex-11-1',
        type: 'word-bank',
        question: 'Create a context',
        correctAnswer: ['const', 'ThemeContext', '=', 'createContext()'],
        wordBank: ['const', 'ThemeContext', '=', 'createContext()', 'React.createContext()', 'useContext()'],
        hint: 'Use createContext to create a new context'
      },
      {
        id: 'ex-11-2',
        type: 'word-bank',
        question: 'Use context in component',
        correctAnswer: ['const', 'theme', '=', 'useContext(ThemeContext)'],
        wordBank: ['const', 'theme', '=', 'useContext(ThemeContext)', 'getContext', 'Context.use'],
        hint: 'useContext hook retrieves context value'
      }
    ]
  },
  'lesson-12': {
    id: 'lesson-12',
    title: 'Custom Hooks',
    description: 'Create reusable hooks',
    xpReward: 25,
    exercises: [
      {
        id: 'ex-12-1',
        type: 'word-bank',
        question: 'Define custom hook',
        correctAnswer: ['function', 'useLocalStorage(key)', '{', 'return', '[value,', 'setValue]', '}'],
        wordBank: ['function', 'useLocalStorage(key)', '{', 'return', '[value,', 'setValue]', '}', 'const', 'hook'],
        hint: 'Custom hooks must start with "use"'
      }
    ]
  },
  'lesson-13': {
    id: 'lesson-13',
    title: 'useReducer Hook',
    description: 'Manage complex state logic',
    xpReward: 30,
    exercises: [
      {
        id: 'ex-13-1',
        type: 'word-bank',
        question: 'Use reducer for state',
        correctAnswer: ['const', '[state,', 'dispatch]', '=', 'useReducer(reducer,', 'initialState)'],
        wordBank: ['const', '[state,', 'dispatch]', '=', 'useReducer(reducer,', 'initialState)', 'useState', 'reducer'],
        hint: 'useReducer takes reducer function and initial state'
      }
    ]
  },
  'lesson-14': {
    id: 'lesson-14',
    title: 'useMemo Hook',
    description: 'Optimize expensive calculations',
    xpReward: 30,
    exercises: [
      {
        id: 'ex-14-1',
        type: 'word-bank',
        question: 'Memoize computed value',
        correctAnswer: ['const', 'result', '=', 'useMemo(()=>', 'expensiveCalc(a,b),', '[a,b])'],
        wordBank: ['const', 'result', '=', 'useMemo(()=>', 'expensiveCalc(a,b),', '[a,b])', 'memo', 'useEffect'],
        hint: 'useMemo caches value until dependencies change'
      }
    ]
  },
  'lesson-15': {
    id: 'lesson-15',
    title: 'useCallback Hook',
    description: 'Memoize callback functions',
    xpReward: 30,
    exercises: [
      {
        id: 'ex-15-1',
        type: 'word-bank',
        question: 'Memoize callback function',
        correctAnswer: ['const', 'handleClick', '=', 'useCallback(()=>{', 'doSomething()', '},', '[dependency])'],
        wordBank: ['const', 'handleClick', '=', 'useCallback(()=>{', 'doSomething()', '},', '[dependency])', 'useMemo', '[]'],
        hint: 'useCallback prevents function recreation on every render'
      }
    ]
  }
};
