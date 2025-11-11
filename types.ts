
export interface ErrorDetail {
  line: number;
  error_type: string;
  description: string;
  suggestion: string;
}

export interface AnalysisResponse {
  has_errors: boolean;
  summary: string;
  errors: ErrorDetail[];
  corrected_code: string;
}
