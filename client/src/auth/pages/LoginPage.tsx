import { useState, type FormEvent } from "react";
import { useLogin, useSignUp } from "../hooks";
import { LoginForm } from "../components/LoginForm";
import { SignupForm } from "../components/SignupForm";
import { Role } from "../types/role";

interface LoginPageProps {
  onBack: () => void;
  onSuccess: (role: Role) => void;
}

export function LoginPage({ onBack, onSuccess }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading: loginLoading, error: loginError } = useLogin();
  const { signup, loading: signupLoading, error: signupError } = useSignUp();
  const loading = isSignUp ? signupLoading : loginLoading;
  const error = isSignUp ? signupError : loginError;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!isSignUp) {
        const result = await login({
          email,
          password,
        });
        onSuccess(result.role);
      } else {
        const result = await signup({
          email,
          password,
          phone,
        });
        onSuccess(result.role);
      }
    } catch {
      // Error state is already managed by useRequest.
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <button className="auth-back" type="button" onClick={onBack}>
          ← Back to movies
        </button>

        <div className="auth-heading">
          <span className="auth-icon">🎬</span>
          <p className="auth-eyebrow">BookMyMovie</p>
          <h2 id="auth-title">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p>
            {isSignUp
              ? "Join us and make your next movie night memorable."
              : "Sign in to continue booking your favorite movies."}
          </p>
        </div>

        {isSignUp ? (
          <SignupForm
            email={email}
            password={password}
            phone={phone}
            loading={loading}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onPhoneChange={setPhone}
            onSubmit={handleSubmit}
          />
        ) : (
          <LoginForm
            email={email}
            password={password}
            loading={loading}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        )}

        <p className="auth-switch">
          {isSignUp ? "Already have an account?" : "New to BookMyMovie?"}{" "}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
