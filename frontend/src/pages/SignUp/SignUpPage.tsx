import { useState, type FC, type InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import tickIcon from "../../assets/tickIcon.svg";
import { Link } from "react-router-dom";
import styles from "./SignUpPage.module.css";
import type { SignUpFormData } from "./types";
import { registerUser } from "../../services/authService";
import { LuEye, LuEyeOff, LuMail, LuUser, LuLock } from "react-icons/lu";

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
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
};

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const SignUpPage: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) setError("");
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreeTerms(checked);
    if (fieldErrors.terms) {
      setFieldErrors((prev) => ({ ...prev, terms: undefined }));
    }
    if (error) setError("");
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
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

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return undefined;
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      ),
      terms: !agreeTerms ? "You must agree to the terms and conditions" : undefined,
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "student",
      });

      navigate("/login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className={styles.signupPage}>
      <Header />
      <div className={styles.containerWrapper}>
        {/* LEFT SIDE INFO */}
        <div className={styles.signuppageinfo}>
          <h2 className={styles.title}>Join Our</h2>
          <h2 className={styles.subtitle}>Community Today</h2>
          <p className={styles.description}>
            Create your account to get started with managing your final year
            project. Access powerful tools for collaboration, progress tracking,
            and milestone management.
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
            <h1 className={styles.heading}>Create an Account</h1>
            <p className={styles.paragraph}>
              Join our community and start managing your project
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <InputField
              label="Full Name"
              name="name"
              leftIcon={LuUser}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={fieldErrors.name}
            />
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
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              leftIcon={LuLock}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={fieldErrors.confirmPassword}
            />

            <div className={styles.termsWrapper}>
              <div className={styles.terms}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => handleTermsChange(e.target.checked)}
                  id="terms"
                />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <span className={styles.termsAndConditions}>
                    terms and conditions
                  </span>
                </label>
              </div>
              {fieldErrors.terms && (
                <span className={styles.fieldError}>{fieldErrors.terms}</span>
              )}
            </div>

            {error && (
              <div className={styles.errorBox}>
                <span className={styles.errorIcon}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={styles.button}>
              Create Account
            </button>

            <div className={styles.loginRedirect}>
              <span>Already have an account? </span>
              <Link to="/login" className={styles.signInHere}>
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;