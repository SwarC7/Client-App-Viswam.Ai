// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";
import { getToken } from "../lib/auth";

export default function Dashboard() {
  const { user, loading, error } = useUser();
  const token = getToken();

  if (loading) return <div className="page"><p>Loading profile…</p></div>;
  if (error)   return <div className="page"><p>Failed to load profile.</p></div>;
  if (!user)   return (
    <div className="page">
      <div className="card">
        <p>You’re not logged in.</p>
        <div className="row"><Link to="/login">Login</Link> <Link to="/signup">Sign Up</Link></div>
      </div>
    </div>
  );

  const fields = [
    ["phone", user.phone],
    ["name", user.name],
    ["email", user.email],
    ["gender", user.gender],
    ["date_of_birth", user.date_of_birth],
    ["place", user.place],
    ["id", user.id],
    ["is_active", String(user.is_active)],
    ["has_given_consent", String(user.has_given_consent)],
    ["consent_given_at", user.consent_given_at],
    ["last_login_at", user.last_login_at],
    ["created_at", user.created_at],
    ["updated_at", user.updated_at],
  ];

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="card">
        <p>You're logged in. Your JWT (truncated):</p>
        <code style={{display:"inline-block", maxWidth: "480px", overflowX:"auto"}}>
          {token?.slice(0, 36)}…
        </code>

        <h3 style={{marginTop:16}}>Your Profile</h3>
        <table className="detail">
          <tbody>
            {fields.map(([k, v]) => (
              <tr key={k}>
                <td style={{fontWeight:600}}>{k}</td>
                <td>{String(v ?? "")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{marginTop:12}}>
          From here you can prefill forms, authorize features, or call other endpoints using the
          same token (the axios client already adds the Bearer header).
        </p>
      </div>
    </div>
  );
}
