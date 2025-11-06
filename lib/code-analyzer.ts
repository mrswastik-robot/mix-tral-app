// implements the function calling tool

import { CodeMetrics } from './types';


export function analyzeCodeComplexity(code: string, language: string): CodeMetrics {
  // Count lines of code
  const lines = code.split('\n').filter(line => line.trim().length > 0);
  const lineCount = lines.length;

  let functionCount = 0;
  
  if (language === 'javascript' || language === 'typescript') {
    const functionPatterns = [
      /function\s+\w+/g,           // function name()
      /const\s+\w+\s*=\s*\(/g,     // const name = ()
      /\w+\s*:\s*\([^)]*\)\s*=>/g, // name: () =>
      /\w+\s*\([^)]*\)\s*{/g,      // name() { (methods)
    ];
    functionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) functionCount += matches.length;
    });
  } else if (language === 'python') {
    // Match Python function and method definitions
    const matches = code.match(/def\s+\w+/g);
    functionCount = matches ? matches.length : 0;
  } else if (language === 'go') {
    // Match Go function definitions
    const matches = code.match(/func\s+(\w+\s*)?\(/g);
    functionCount = matches ? matches.length : 0;
  } else if (language === 'rust') {
    // Match Rust function definitions
    const matches = code.match(/fn\s+\w+/g);
    functionCount = matches ? matches.length : 0;
  }

  // calculate complexity score based on lines, functions, and nesting depth indicators
  const nestingIndicators = (code.match(/[{([\]})]/g) || []).length;
  const complexityScore = Math.min(100, Math.round(
    (lineCount * 0.5) + 
    (functionCount * 5) + 
    (nestingIndicators * 0.3)
  ));

  // estimate read time (assuming ~10 lines per minute for code review)
  const readTimeMinutes = Math.max(1, Math.ceil(lineCount / 10));
  const estimatedReadTime = readTimeMinutes === 1 
    ? '1 minute' 
    : `${readTimeMinutes} minutes`;

  return {
    lineCount,
    functionCount,
    complexityScore,
    estimatedReadTime,
  };
}

// tool definition
export const codeAnalyzerTool = {
  type: 'function' as const,
  function: {
    name: 'analyze_code_complexity',
    description: 'Analyzes code complexity and returns metrics including line count, function count, complexity score, and estimated read time.',
    parameters: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The source code to analyze',
        },
        language: {
          type: 'string',
          description: 'The programming language of the code (javascript, typescript, python, go, or rust)',
          enum: ['javascript', 'typescript', 'python', 'go', 'rust'],
        },
      },
      required: ['code', 'language'],
    },
  },
};

