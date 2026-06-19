// ============================================================================
// Shared Request Options
// ============================================================================

export interface RequestOptions {
  errorMessage?: string;
  signal?: AbortSignal;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  code?: string;
}
