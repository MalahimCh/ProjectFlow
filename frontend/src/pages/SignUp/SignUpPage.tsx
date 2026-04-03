import { useState, type FC, type InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { CiUser, CiLock } from "react-icons/ci";
import tickIcon from "../../assets/tickIcon.svg";
import { Link } from "react-router-dom";
import styles from "./SignUpPage.module.css";
import type { SignUpFormData } from "./types";


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
}

const InputField: FC<InputProps> = ({
  label,
  leftIcon: LeftIcon,
  type,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputContainer}>
        {LeftIcon && <LeftIcon className={styles.icon} />}
        <input
          className={styles.input}
          type={isPassword ? (showPassword ? "text" : "password") : type || "text"}
          placeholder={label}
          {...inputProps}
        />
        {isPassword &&
          (showPassword ? (
            <FaRegEyeSlash
              className={styles.icon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaRegEye
              className={styles.icon}
              onClick={() => setShowPassword(true)}
            />
          ))}
      </div>
    </div>
  );
};


const SignUpPage: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (!formData.name || !formData.email || !formData.password || !formData.username) {
      setError("All fields are required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Form Data:", formData);
    // API call
    navigate("/login");
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
            Create your account to get started with managing your final year project. Access powerful tools for collaboration, progress tracking, and milestone management.
          </p>
          <ul className={styles.features}>
            {[
              ["Powerful Collaboration Tools", "Work seamlessly with your team members"],
              ["Progress Tracking", "Monitor your project milestones in real-time"],
              ["Milestone Management", "Set and achieve your project goals efficiently"],
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <InputField
              label="Full Name"
              name="name"
              leftIcon={CiUser}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              leftIcon={IoMailOutline}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <InputField
              label="Username"
              name="username"
              leftIcon={CiUser}
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              leftIcon={CiLock}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              leftIcon={CiLock}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />

            <div className={styles.terms}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                id="terms"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <span className={styles.termsAndConditions}>
                  terms and conditions
                </span>
              </label>
            </div>

            {error && (
              <div className={styles.errorBox}>
                <span className={styles.errorIcon}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={styles.button} disabled={!agreeTerms}>
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