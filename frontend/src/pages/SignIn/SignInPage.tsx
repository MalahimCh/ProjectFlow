import { useState, type FC, type InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import tickIcon from "../../assets/tickIcon.svg";
import { Link } from "react-router-dom";
import styles from "./SignInPage.module.css";
import type { SignInFormData } from "./types";
import { LuEye, LuEyeOff, LuMail, LuLock } from "react-icons/lu";
import { loginUser } from "../../services/authService";

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <b className={styles.projectflow}>ProjectFlow</b>
    </header>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leftIcon?: FC<{ className?: string }>;
  rightIcon?: FC<{ className?: string }>;
  error?: string;
}

const InputField: FC<InputProps> = ({
  label,
  leftIcon: LeftIcon,
  type,
  error,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={`${styles.inputContainer} ${error ? styles.inputError : ""}`}>
        {LeftIcon && <LeftIcon className={styles.icon} />}
        <input
          className={styles.input}
          type={
            isPassword ? (showPassword ? "text" : "password") : type || "text"
          }
          placeholder={label}
          {...inputProps}
        />
        {isPassword &&
          (showPassword ? (
            <LuEyeOff
              className={styles.icon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <LuEye
              className={styles.icon}
              onClick={() => setShowPassword(true)}
            />
          ))}
      </div>
      {error && (
        <span className={styles.fieldError}>{error}</span>
      )}
    </div>
  );
};

interface FieldErrors {
  email?: string;
  password?: string;
}

const SignInPage: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) setError("");
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      navigate(res.data.redirectTo);
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.signinPage}>
      <Header />
      <div className={styles.containerWrapper}>
        {/* LEFT SIDE INFO */}
        <div className={styles.signinpageinfo}>
          <h2 className={styles.title}>Final Year Project</h2>
          <h2 className={styles.subtitle}>Management System</h2>
          <p className={styles.description}>
            Streamline your final year project workflow with our comprehensive
            management system. Track progress, collaborate with supervisors, and
            manage your project milestones efficiently.
          </p>
          <ul className={styles.features}>
            {[
              [
                "Powerful Collaboration Tools",
                "Work seamlessly with your team members",
              ],
              [
                "Progress Tracking",
                "Monitor your project milestones in real-time",
              ],
              [
                "Milestone Management",
                "Set and achieve your project goals efficiently",
              ],
            ].map(([title, desc], i) => (
              <li key={i}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <img src={tickIcon} alt="tick" />
                  </div>
                  <div>
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className={styles.container}>
          <div className={styles.headingSection}>
            <h1 className={styles.heading}>Welcome Back</h1>
            <p className={styles.paragraph}>
              Sign in to continue to ProjectFlow
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <InputField
              label="Email"
              name="email"
              type="email"
              leftIcon={LuMail}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={fieldErrors.email}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              leftIcon={LuLock}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={fieldErrors.password}
            />

            <div className={styles.optionsRow}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className={styles.errorBox}>
                <span className={styles.errorIcon}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={styles.button}>
              Sign In
            </button>

            <div className={styles.loginRedirect}>
              <span>Don't have an account? </span>
              <Link to="/" className={styles.signInHere}>
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;