import { useState, type FC, type InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import tickIcon from "../../assets/tickIcon.svg";
import { Link } from "react-router-dom";
import styles from "./SignInPage.module.css";
import type { SignInFormData } from "./types";

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


const SignInPage: FC = () => {
  
    const navigate = useNavigate();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field: keyof SignInFormData, value: string) => {          
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
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
    navigate("/dashboard");
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
            Streamline your final year project workflow with our comprehensive management system. 
            Track progress, collaborate with supervisors, and manage your project milestones efficiently.</p>
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
            <h1 className={styles.heading}>Welcome Back</h1>
            <p className={styles.paragraph}>
              Sign in to continue to ProjectFlow
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
        
            <InputField
              label="Email"
              name="email"
              type="email"
              leftIcon={IoMailOutline}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              leftIcon={CiLock}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
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

            <button type="submit" className={styles.button} >
              Sign In
            </button>

            <div className={styles.loginRedirect}>
              <span>Dont have an account? </span>
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