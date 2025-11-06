'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeReviewRequest, CodeReviewResponse, SupportedLanguage } from '@/lib/types';
import PixelBlast from '@/components/PixelBlast';
import { Mistral } from '@lobehub/icons';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeReviewResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      alert('Please enter some code to review');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const requestBody: CodeReviewRequest = {
        code,
        language,
      };

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: CodeReviewResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to review code');
      }

      setResult(data);
    } catch (error) {
      setResult({
        review: '',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleCode: Record<SupportedLanguage, string> = {
    javascript: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
    typescript: `interface User {
  name: string;
  age: number;
}

function greetUser(user: User) {
  console.log("Hello " + user.name);
  if (user.age > 18) {
    console.log("You are an adult");
  }
}`,
    python: `def process_data(data):
    result = []
    for item in data:
        if item != None:
            result.append(item * 2)
    return result`,
    go: `func processUsers(users []User) []string {
    var names []string
    for i := 0; i < len(users); i++ {
        if users[i].Active {
            names = append(names, users[i].Name)
        }
    }
    return names
}`,
    rust: `fn calculate_sum(numbers: Vec<i32>) -> i32 {
    let mut sum = 0;
    for num in numbers {
        sum = sum + num;
    }
    return sum;
}`,
  };

  const loadExample = () => {
    setCode(exampleCode[language]);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* PixelBlast Animated Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={3}
          color="#FF7000"
          liquid={true}
          liquidStrength={0.15}
          enableRipples={true}
          rippleIntensityScale={1.5}
          patternDensity={0.8}
          patternScale={2.5}
          transparent={true}
          edgeFade={0.3}
          speed={0.3}
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            AI Code Review Assistant
          </h1>
          <p className="text-lg flex justify-center text-zinc-300 drop-shadow">
            Powered by <span className='mx-2'><Mistral.Combine size={28} type={'color'} /></span> • Get instant feedback on your code
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-orange-500/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Programming Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="w-full px-4 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Your Code
                  </label>
                  <button
                    type="button"
                    onClick={loadExample}
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline transition-colors"
                  >
                    Load Example
                  </button>
                </div>
                
                {/* Code Editor with Syntax Highlighting */}
                {code ? (
                  <div className="relative">
                    <SyntaxHighlighter
                      language={language === 'go' ? 'go' : language === 'rust' ? 'rust' : language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        maxHeight: '400px',
                        minHeight: '400px',
                      }}
                      showLineNumbers={true}
                    >
                      {code}
                    </SyntaxHighlighter>
                    <button
                      type="button"
                      onClick={() => setCode('')}
                      className="absolute top-2 right-2 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded shadow-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <textarea
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Paste your ${language} code here...`}
                    rows={16}
                    className="w-full px-4 py-3 border border-orange-300 dark:border-orange-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Reviewing Code...
                  </span>
                ) : (
                  'Review Code'
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-orange-500/20 p-6 overflow-y-auto max-h-[600px]">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Review Results
            </h2>

            {!result && !loading && (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Submit your code to get AI-powered review</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
                </div>
              </div>
            )}

            {result?.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">❌ Error</h3>
                <p className="text-red-700 dark:text-red-300">{result.error}</p>
              </div>
            )}

            {result?.review && !result.error && (
              <div className="space-y-6">
                {/* Metrics Card */}
                {result.metrics && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-3">
                      📊 Code Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-orange-700 dark:text-orange-400 font-medium">Lines:</span>
                        <span className="ml-2 text-orange-900 dark:text-orange-200">{result.metrics.lineCount}</span>
                      </div>
                      <div>
                        <span className="text-orange-700 dark:text-orange-400 font-medium">Functions:</span>
                        <span className="ml-2 text-orange-900 dark:text-orange-200">{result.metrics.functionCount}</span>
                      </div>
                      <div>
                        <span className="text-orange-700 dark:text-orange-400 font-medium">Complexity:</span>
                        <span className="ml-2 text-orange-900 dark:text-orange-200">{result.metrics.complexityScore}/100</span>
                      </div>
                      <div>
                        <span className="text-orange-700 dark:text-orange-400 font-medium">Read Time:</span>
                        <span className="ml-2 text-orange-900 dark:text-orange-200">{result.metrics.estimatedReadTime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Content with Markdown Rendering */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code: (props) => {
                        const { children, className } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        const isCodeBlock = match && typeof children === 'string';
                        
                        return isCodeBlock ? (
                          <SyntaxHighlighter
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className}>
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-6 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-5 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-zinc-800 dark:text-zinc-200 mb-3 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-zinc-800 dark:text-zinc-200 space-y-2 mb-4">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-zinc-800 dark:text-zinc-200 space-y-2 mb-4">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-zinc-800 dark:text-zinc-200 ml-4">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-zinc-900 dark:text-zinc-100">{children}</strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-700 dark:text-zinc-300 my-4">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {result.review}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-zinc-300">
          <p className="drop-shadow">
            Built with{' '}
            <a
              href="https://mistral.ai"
            target="_blank"
            rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 hover:underline transition-colors font-medium"
            >
              Mistral AI
            </a>
            {' • '}
            <a
              href="https://github.com/mrswastik-robot/mix-tral-app/"
            target="_blank"
            rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 hover:underline transition-colors font-medium"
          >
              View on GitHub
          </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
