
import React, { useState, useCallback } from 'react';
import { AnalysisResponse, ErrorDetail } from './types';
import { debugPythonScript } from './services/geminiService';
import Spinner from './components/Spinner';
import CodeBlock from './components/CodeBlock';

const defaultCode = `
import numpy as np

def calculate_average(numbers)
  total = sum(numbers)
  count = len(numbers)
  average = total / count
  print("The average is:", avearge)

data = [10, 20, 30, '40', 50]
calculate_average(data)

def another_function():
  x = 10
  y = 0
  result = x / y # Potential division by zero
  return result
`;

const Header: React.FC = () => (
  <header className="py-6 flex items-center justify-center space-x-4">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4584b6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
    <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
      Python Debug Assistant
    </h1>
  </header>
);

const AnalysisResults: React.FC<{ results: AnalysisResponse }> = ({ results }) => {
  const getErrorRowClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'syntaxerror': return 'bg-red-900/50';
      case 'logic error': return 'bg-yellow-900/50';
      case 'typeerror': return 'bg-purple-900/50';
      default: return 'bg-gray-800/50';
    }
  }

  return (
    <div className="space-y-8 mt-6">
      <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-3 text-blue-300">Analysis Summary</h3>
        <p className="text-brand-text-muted">{results.summary}</p>
      </div>

      {results.has_errors && results.errors.length > 0 && (
        <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-yellow-300">Identified Issues</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-brand-primary">
                <tr>
                  <th className="p-3 text-sm font-medium">Line</th>
                  <th className="p-3 text-sm font-medium">Type</th>
                  <th className="p-3 text-sm font-medium">Description</th>
                  <th className="p-3 text-sm font-medium">Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {results.errors.map((error, index) => (
                  <tr key={index} className={`border-b border-brand-primary/50 ${getErrorRowClass(error.error_type)}`}>
                    <td className="p-3 font-mono text-center w-16">{error.line > 0 ? error.line : 'N/A'}</td>
                    <td className="p-3 font-medium w-32"><span className="px-2 py-1 bg-brand-primary rounded-md text-xs">{error.error_type}</span></td>
                    <td className="p-3 text-brand-text-muted">{error.description}</td>
                    <td className="p-3 text-brand-text">{error.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-2 text-green-300">Corrected Script</h3>
        <CodeBlock code={results.corrected_code} language="python" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [pythonCode, setPythonCode] = useState<string>(defaultCode.trim());
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDebug = useCallback(async () => {
    if (!pythonCode.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await debugPythonScript(pythonCode);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [pythonCode, isLoading]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">Your Python Script</h2>
            <div className="bg-brand-primary rounded-lg">
              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                placeholder="Paste your Python code here..."
                className="w-full h-96 p-4 bg-transparent font-mono text-sm text-gray-300 border-2 border-brand-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              />
            </div>
            <button
              onClick={handleDebug}
              disabled={isLoading || !pythonCode.trim()}
              className="mt-6 w-full flex items-center justify-center bg-brand-accent hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                'Debug Script'
              )}
            </button>
          </div>
          
          <div className="mt-8 lg:mt-0">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full bg-brand-surface p-6 rounded-lg shadow-lg">
                  <div className="text-center">
                      <div className="inline-block relative">
                          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-accent"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                          </div>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-gray-300">Analyzing your code...</p>
                      <p className="text-brand-text-muted">The AI is meticulously checking for errors.</p>
                  </div>
              </div>
            )}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {analysisResult ? (
              <AnalysisResults results={analysisResult} />
            ) : !isLoading && !error && (
               <div className="flex flex-col items-center justify-center h-full bg-brand-surface p-6 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <h2 className="mt-4 text-2xl font-semibold text-gray-300">Awaiting Analysis</h2>
                <p className="mt-2 text-center text-brand-text-muted">
                  Enter your Python code on the left and click "Debug Script" to get an AI-powered analysis and correction.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
