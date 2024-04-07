import { useContext, useState } from "react";
import { Link } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const Login = () => {
  const { toast } = useContext(ToastContext);
  const { loginUser } = useContext(AuthContext); //FROM AUTH CONTEXT
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault(); //AVOID PAGE FROM RELOADING
  
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter all the required fields!!!");
      return;
    }
    loginUser(credentials);
  };
  return (
    <>
      <h3>Login</h3>

      <form onSubmit={handleSubmit}>
        {/* EMAIL INPUT */}

        <div>
          <label htmlFor="emailInput" className="form-label mt-4">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            aria-describedby="emailHelp"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="mail@example.com"
            required
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>

        {/*  PASSWORD INPUT */}

        <div>
          <label htmlFor="passwordInput" className="form-label mt-4">
            password
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </div>
        <input type="submit" value="Login" className="btn btn-primary my-3" />
        <p>
          Don't have an account? <Link to="/register">Create One</Link>
        </p>
      </form>
    </>
  );
};
export default Login;
