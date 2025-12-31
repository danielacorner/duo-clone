export interface Exercise {
  id: string;
  type: 'fill-in-blank' | 'word-bank' | 'multiple-choice';
  question: string;
  prompt?: string; // For audio or display text
  correctAnswer: string[];
  wordBank: string[];
  tip?: string; // General advice (e.g., "Use camelCase for event handlers")
  hint?: string; // Specific clue about the correct answer (hidden by default)
  codeContext?: {
    before: string[]; // Lines of code before the blank
    blankLine: string; // The line with the blank (prefix before the answer)
    after: string[]; // Lines of code after the blank
  };
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
        tip:'Components must return JSX',
        hint: 'Use "return" followed by a <div> containing "Hello"',
        codeContext: {
          before: [
            '// Welcome.tsx',
            'function Welcome() {'
          ],
          blankLine: '  ',
          after: [
            '}'
          ]
        }
      },
      {
        id: 'ex-1-2',
        type: 'word-bank',
        question: 'Create a component that displays a greeting',
        correctAnswer: ['function', 'Greeting', '()', '{', 'return', '<h1>', 'Welcome!', '</h1>', '}'],
        wordBank: ['function', 'Greeting', '()', '{', 'return', '<h1>', 'Welcome!', '</h1>', '}', 'class', 'render', 'const'],
        tip:'Function components return JSX',
        codeContext: {
          before: [
            '// Greeting.tsx',
            'import React from "react"',
            ''
          ],
          blankLine: '',
          after: [
            '',
            'export default Greeting'
          ]
        }
      },
      {
        id: 'ex-1-3',
        type: 'word-bank',
        question: 'Export a component',
        correctAnswer: ['export', 'default', 'Welcome'],
        wordBank: ['export', 'default', 'Welcome', 'import', 'function', 'const', 'module'],
        tip:'Use default export',
        codeContext: {
          before: [
            '// Welcome.tsx',
            'function Welcome() {',
            '  return <div>Hello</div>',
            '}',
            ''
          ],
          blankLine: '',
          after: []
        }
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
        tip:'Use curly braces for expressions',
        hint: 'Wrap the variable "name" in curly braces {name} inside an <h1>',
        codeContext: {
          before: [
            'function Greeting() {',
            '  const name = "React"',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-2-2',
        type: 'word-bank',
        question: 'JSX must have a single parent element',
        correctAnswer: ['<div>', '<h1>', 'Title', '</h1>', '<p>', 'Text', '</p>', '</div>'],
        wordBank: ['<div>', '<h1>', 'Title', '</h1>', '<p>', 'Text', '</p>', '</div>', '<>', '</>'],
        tip:'Wrap multiple elements in a parent',
        codeContext: {
          before: [
            'function Card() {',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
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
        tip:'Use destructuring for props',
        hint: 'Create a function called Greeting that destructures the name prop',
        codeContext: {
          before: [
            '// Greeting.tsx'
          ],
          blankLine: '',
          after: [
            '  return <h1>Hello, {name}!</h1>',
            '}',
            '',
            'export default Greeting'
          ]
        }
      },
      {
        id: 'ex-3-2',
        type: 'word-bank',
        question: 'Pass props to a component',
        correctAnswer: ['<Greeting', 'name=', '"Alice"', '/>'],
        wordBank: ['<Greeting', 'name=', '"Alice"', '/>', 'props=', '{name}', 'value='],
        tip:'Use attribute syntax in JSX',
        hint: 'Set the name prop to the string "Alice" on the Greeting component',
        codeContext: {
          before: [
            'import Greeting from "./Greeting"',
            '',
            'function App() {',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
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
        tip:'Combine component declaration and JSX return',
        codeContext: {
          before: [
            '// App.tsx',
            'import React from "react"',
            ''
          ],
          blankLine: '',
          after: [
            '',
            'export default App'
          ]
        }
      },
      {
        id: 'ex-p1-2',
        type: 'word-bank',
        question: 'Use props with JSX expression',
        correctAnswer: ['<div>', '{props.message}', '</div>'],
        wordBank: ['<div>', '{props.message}', '</div>', '(props.message)', 'props.message', '${props.message}'],
        tip:'Access props with dot notation inside curly braces',
        codeContext: {
          before: [
            'function MessageDisplay(props) {',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
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
        question: 'Initialize state with a default value',
        correctAnswer: ['const', '[isOpen,', 'setIsOpen]', '=', 'useState(false)'],
        wordBank: ['const', '[isOpen,', 'setIsOpen]', '=', 'useState(false)', 'useState(true)', 'let', 'var'],
        tip:'useState returns array with state and setter',
        hint: 'Destructure [isOpen, setIsOpen] from useState(false)',
        codeContext: {
          before: [
            'import { useState } from "react"',
            '',
            'function Modal() {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return (',
            '    <div>',
            '      {isOpen && <div>Modal Content</div>}',
            '    </div>',
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-4-2',
        type: 'word-bank',
        question: 'Declare state with useState',
        correctAnswer: ['const', '[count,', 'setCount]', '=', 'useState(0)'],
        wordBank: ['const', '[count,', 'setCount]', '=', 'useState(0)', 'let', 'var', 'this.state'],
        tip:'Array destructuring for state and setter',
        hint: 'Start with "const" and destructure [count, setCount] from useState(0)',
        codeContext: {
          before: [
            'import { useState } from "react"',
            '',
            'function Counter() {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <div>Count: {count}</div>',
            '}'
          ]
        }
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
        tip:'Use camelCase for event handlers',
        hint: 'The handler function is called "handleClick" - pass it using curly braces',
        codeContext: {
          before: [
            'function Counter() {',
            '  const [count, setCount] = useState(0)',
            '',
            '  const handleClick = () => {',
            '    setCount(count + 1)',
            '  }',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-5-2',
        type: 'word-bank',
        question: 'Update state on click',
        correctAnswer: ['setCount(count', '+', '1)'],
        wordBank: ['setCount(count', '+', '1)', 'count++', 'count', '=', 'setState'],
        tip:'Call the setter function with new value',
        hint: 'Use setCount() and add 1 to the current count value',
        codeContext: {
          before: [
            'function Counter() {',
            '  const [count, setCount] = useState(0)',
            '',
            '  const handleClick = () => {'
          ],
          blankLine: '    ',
          after: [
            '  }',
            '',
            '  return <button onClick={handleClick}>{count}</button>',
            '}'
          ]
        }
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
        question: 'Run effect when dependency changes',
        correctAnswer: ['useEffect(()=>{', 'updateTitle()', '},', '[count]', ')'],
        wordBank: ['useEffect(()=>{', 'updateTitle()', '},', '[count]', ')', '[]', 'useEffect', '[data]'],
        tip:'Effect runs when count changes',
        hint: 'Pass [count] as the dependency array to run the effect when count changes',
        codeContext: {
          before: [
            'import { useState, useEffect } from "react"',
            '',
            'function Counter() {',
            '  const [count, setCount] = useState(0)',
            '',
            '  const updateTitle = () => {',
            '    document.title = `Count: ${count}`',
            '  }',
            ''
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <div>{count}</div>',
            '}'
          ]
        }
      },
      {
        id: 'ex-6-2',
        type: 'word-bank',
        question: 'Run effect on mount',
        correctAnswer: ['useEffect(()=>{', 'fetchData()', '},', '[]', ')'],
        wordBank: ['useEffect(()=>{', 'fetchData()', '},', '[]', ')', '[data]', 'useEffect'],
        tip:'Empty dependency array runs once on mount',
        codeContext: {
          before: [
            'import { useState, useEffect } from "react"',
            '',
            'function DataDisplay() {',
            '  const [data, setData] = useState(null)',
            '',
            '  const fetchData = async () => {',
            '    const response = await fetch("/api/data")',
            '    setData(await response.json())',
            '  }',
            ''
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <div>{JSON.stringify(data)}</div>',
            '}'
          ]
        }
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
        tip:'Use ternary for if-else in JSX',
        hint: 'Use the pattern: {condition ? <TrueComponent/> : <FalseComponent/>}',
        codeContext: {
          before: [
            'function App() {',
            '  const [isLoggedIn, setIsLoggedIn] = useState(false)',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-7-2',
        type: 'word-bank',
        question: 'Conditionally render with logical AND',
        correctAnswer: ['{hasError', '&&', '<ErrorMessage/>}'],
        wordBank: ['{hasError', '&&', '<ErrorMessage/>}', '?', ':', 'if', '||'],
        tip:'Use && to render only when condition is true',
        codeContext: {
          before: [
            'function Form() {',
            '  const [hasError, setHasError] = useState(false)',
            '',
            '  return (',
            '    <div>'
          ],
          blankLine: '      ',
          after: [
            '      <input type="text" />',
            '    </div>',
            '  )',
            '}'
          ]
        }
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
        tip:'Always add key prop to list items',
        codeContext: {
          before: [
            'function ItemList({ items }) {',
            '  return (',
            '    <ul>'
          ],
          blankLine: '      ',
          after: [
            '    </ul>',
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-8-2',
        type: 'word-bank',
        question: 'Filter and map an array',
        correctAnswer: ['{users.filter(u', '=>', 'u.active).map(u', '=>', '<User', 'key={u.id}', '/>)}'],
        wordBank: ['{users.filter(u', '=>', 'u.active).map(u', '=>', '<User', 'key={u.id}', '/>)}', 'forEach', 'if', 'id='],
        tip:'Chain filter and map for conditional lists',
        codeContext: {
          before: [
            'function ActiveUsers({ users }) {',
            '  return (',
            '    <div>'
          ],
          blankLine: '      ',
          after: [
            '    </div>',
            '  )',
            '}'
          ]
        }
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
        tip:'Use value and onChange for controlled inputs',
        codeContext: {
          before: [
            'function NameForm() {',
            '  const [name, setName] = useState("")',
            '',
            '  const handleChange = (e) => setName(e.target.value)',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-9-2',
        type: 'word-bank',
        question: 'Handle form submission',
        correctAnswer: ['<form', 'onSubmit={handleSubmit}', '>', '<button', 'type=', '"submit"', '>', 'Submit', '</button>', '</form>'],
        wordBank: ['<form', 'onSubmit={handleSubmit}', '>', '<button', 'type=', '"submit"', '>', 'Submit', '</button>', '</form>', 'onClick=', 'onsubmit='],
        tip:'Use onSubmit on form element',
        codeContext: {
          before: [
            'function ContactForm() {',
            '  const handleSubmit = (e) => {',
            '    e.preventDefault()',
            '    // Submit form data',
            '  }',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
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
        tip:'Pass both value and setter to child',
        codeContext: {
          before: [
            'function Parent() {',
            '  const [count, setCount] = useState(0)',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
      },
      {
        id: 'ex-10-2',
        type: 'word-bank',
        question: 'Define parent component with shared state',
        correctAnswer: ['const', '[text,', 'setText]', '=', 'useState(', '""', ')'],
        wordBank: ['const', '[text,', 'setText]', '=', 'useState(', '""', ')', 'null', 'undefined', 'let'],
        tip:'Initialize state in parent to share with children',
        codeContext: {
          before: [
            'import { useState } from "react"',
            '',
            'function ParentComponent() {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return (',
            '    <>',
            '      <InputChild value={text} onChange={setText} />',
            '      <DisplayChild value={text} />',
            '    </>',
            '  )',
            '}'
          ]
        }
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
        tip:'Use createContext to create a new context',
        codeContext: {
          before: [
            '// ThemeContext.tsx',
            'import { createContext } from "react"',
            ''
          ],
          blankLine: '',
          after: [
            '',
            'export default ThemeContext'
          ]
        }
      },
      {
        id: 'ex-11-2',
        type: 'word-bank',
        question: 'Use context in component',
        correctAnswer: ['const', 'theme', '=', 'useContext(ThemeContext)'],
        wordBank: ['const', 'theme', '=', 'useContext(ThemeContext)', 'getContext', 'Context.use'],
        tip:'useContext hook retrieves context value',
        codeContext: {
          before: [
            'import { useContext } from "react"',
            'import ThemeContext from "./ThemeContext"',
            '',
            'function ThemedButton() {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return (',
            '    <button style={{ background: theme.color }}>',
            '      Click me',
            '    </button>',
            '  )',
            '}'
          ]
        }
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
        tip:'Custom hooks must start with "use"',
        codeContext: {
          before: [
            '// useLocalStorage.ts',
            'import { useState, useEffect } from "react"',
            ''
          ],
          blankLine: '',
          after: [
            '',
            'export default useLocalStorage'
          ]
        }
      },
      {
        id: 'ex-12-2',
        type: 'word-bank',
        question: 'Use custom hook in component',
        correctAnswer: ['const', '[data,', 'setData]', '=', 'useLocalStorage(', '"key"', ')'],
        wordBank: ['const', '[data,', 'setData]', '=', 'useLocalStorage(', '"key"', ')', 'useState', 'useEffect'],
        tip:'Custom hooks work like built-in hooks',
        codeContext: {
          before: [
            'import useLocalStorage from "./useLocalStorage"',
            '',
            'function Settings() {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <div>{data}</div>',
            '}'
          ]
        }
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
        tip:'useReducer takes reducer function and initial state',
        codeContext: {
          before: [
            'import { useReducer } from "react"',
            '',
            'const initialState = { count: 0 }',
            'const reducer = (state, action) => { /* ... */ }',
            '',
            'function Counter() {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <div>{state.count}</div>',
            '}'
          ]
        }
      },
      {
        id: 'ex-13-2',
        type: 'word-bank',
        question: 'Dispatch an action',
        correctAnswer: ['dispatch({', 'type:', '"INCREMENT",', 'payload:', '1', '})'],
        wordBank: ['dispatch({', 'type:', '"INCREMENT",', 'payload:', '1', '})', 'setState', 'action'],
        tip:'Dispatch objects with type and payload',
        codeContext: {
          before: [
            'function Counter() {',
            '  const [state, dispatch] = useReducer(reducer, initialState)',
            '',
            '  const handleClick = () => {'
          ],
          blankLine: '    ',
          after: [
            '  }',
            '',
            '  return <button onClick={handleClick}>+</button>',
            '}'
          ]
        }
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
        tip:'useMemo caches value until dependencies change',
        codeContext: {
          before: [
            'import { useMemo } from "react"',
            '',
            'function Calculator({ a, b }) {',
            '  const expensiveCalc = (x, y) => {',
            '    // Complex calculation',
            '    return x * y',
            '  }',
            ''
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <div>{result}</div>',
            '}'
          ]
        }
      },
      {
        id: 'ex-14-2',
        type: 'word-bank',
        question: 'Memoize filtered list',
        correctAnswer: ['const', 'filtered', '=', 'useMemo(()=>', 'items.filter(filterFn),', '[items,', 'filterFn])'],
        wordBank: ['const', 'filtered', '=', 'useMemo(()=>', 'items.filter(filterFn),', '[items,', 'filterFn])', '[]', 'useEffect'],
        tip:'Avoid re-filtering on every render',
        codeContext: {
          before: [
            'import { useMemo } from "react"',
            '',
            'function ItemList({ items, filterFn }) {'
          ],
          blankLine: '  ',
          after: [
            '',
            '  return (',
            '    <ul>',
            '      {filtered.map(item => <li key={item.id}>{item.name}</li>)}',
            '    </ul>',
            '  )',
            '}'
          ]
        }
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
        tip:'useCallback prevents function recreation on every render',
        codeContext: {
          before: [
            'import { useCallback } from "react"',
            '',
            'function Parent({ dependency }) {',
            '  const doSomething = () => console.log(dependency)',
            ''
          ],
          blankLine: '  ',
          after: [
            '',
            '  return <Child onClick={handleClick} />',
            '}'
          ]
        }
      },
      {
        id: 'ex-15-2',
        type: 'word-bank',
        question: 'Pass memoized callback to child',
        correctAnswer: ['<Button', 'onClick={memoizedHandler}', '/>'],
        wordBank: ['<Button', 'onClick={memoizedHandler}', '/>', 'onClick={()=>handler()}', 'handler=', 'function='],
        tip:'Prevents child re-renders when parent re-renders',
        codeContext: {
          before: [
            'function Parent() {',
            '  const memoizedHandler = useCallback(() => {',
            '    // Handle click',
            '  }, [])',
            '',
            '  return ('
          ],
          blankLine: '    ',
          after: [
            '  )',
            '}'
          ]
        }
      }
    ]
  }
};
