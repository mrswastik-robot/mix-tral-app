
export interface CodeReviewRequest {
  code: string;
  language: string;
}

export interface CodeMetrics {
  lineCount: number;
  functionCount: number;
  complexityScore: number;
  estimatedReadTime: string;
}

export interface CodeReviewResponse {
  review: string;
  metrics?: CodeMetrics;
  error?: string;
}

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'go' | 'rust';

