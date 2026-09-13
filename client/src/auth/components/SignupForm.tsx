import type { FormEvent } from "react";

interface SignupFormProps {
  email: string;
  password: string;
  phone: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupForm({
  email,
  password,
  phone,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onPhoneChange,
  onSubmit,
}: SignupFormProps) {
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

      <label>
        Phone
        <input
          type="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="Enter your phone"
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button
        className="btn-primary auth-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
