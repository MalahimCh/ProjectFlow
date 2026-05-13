import styles from "../ProjectDetails.module.css";

interface GradeMember {
  name: string;
  initials: string;
  scores: string[];
  avg: string;
  grade: string;
}

interface Props {
  grades: GradeMember[];
}

export default function GradeTab({ grades }: Props) {
  return (
    <div className={styles.request}>
      <div className={styles.requestHeader}>
        <p className={styles.requestTitle}>Grade Overview</p>
      </div>
      <div className={styles.gradeCard}>
        <table className={styles.gradeTable}>
          <thead>
            <tr>
              <th>Team Member</th>
              {[
                "Proposal",
                "SRS Doc",
                "Mid-Term Pres.",
                "Progress Report",
                "Literature Review",
              ].map((title, i) => (
                <th key={i}>{title}</th>
              ))}
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((member, idx) => (
              <tr key={idx}>
                <td>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatarSmall}>{member.initials}</div>
                    {member.name}
                  </div>
                </td>
                {member.scores.map((score, i) => (
                  <td key={i}>{score}</td>
                ))}
                <td>
                  <strong>{member.avg}</strong>
                  <span className={styles.gradeLabel}>{member.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
