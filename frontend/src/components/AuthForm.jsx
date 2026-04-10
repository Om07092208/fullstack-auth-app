import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

function AuthForm({ mode, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);

    if (mode === "register") {
      setFormData(initialForm);
    } else {
      setFormData((current) => ({ ...current, password: "" }));
    }
  };

  return (
    <form className="card auth-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">{mode === "register" ? "Create account" : "Welcome back"}</p>
        <h2>{mode === "register" ? "Register" : "Login"}</h2>
      </div>

      {mode === "register" && (
        <label>
          Full Name
          <input
            name="name"
            type="text"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
      )}

      <label>
        Email
        <input
          name="email"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          minLength="6"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : mode === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
}

export default AuthForm;
