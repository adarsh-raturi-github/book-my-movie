import type { FormEvent } from "react";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
  loadingLabel?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  email,
  password,
  loading,
  error,
  submitLabel = "Sign in",
  loadingLabel = "Signing in...",
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        Email address
        <input
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Enter your password"
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button
        className="btn-primary auth-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
