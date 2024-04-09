import {
  createContext,
  
  useContext,
  useEffect,
  useState,
} from "react";
import ToastContext from "./ToastContext";
import { useNavigate,useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();  //When you call useNavigate(), it returns a navigate function that you can use to navigate programmatically within your application.
  const location = useLocation();
  // useLocation is a hook provided by React Router. It allows you to access the current location object in the router's context.
  // The location object contains information about the current URL, including the pathname, search parameters, hash, and state.


  const [user, setUser] = useState(null);
  // const [error, setError] = useState(null);
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  //check if the user is logged in
  const checkUserLoggedIn = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true }); //CHECKING IF THE LOCAL STORAGE DO NOT HAVE TOKEN THEN THE USER IS NOT LOGGED IN
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      if (!result.error) {
        if (
          location.pathname === "/login" ||
          location.pathname === "/register"
        ) {
          setTimeout(() => {
            navigate("/", { replace: true }); //replace: true: This option tells the routing library to replace the current entry in the navigation history with the new location instead of adding a new entry to the history stack.
          }, 500);
        } else {
          navigate(location.pathname ? location.pathname : "/");
        }
        setUser(result);
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //loginrequest            //userData pe credentials aaye login.js se
  const loginUser = async (userData) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();
      if (!result.error) {
        //console.log(result);
        localStorage.setItem("token", result.token);
        setUser(result.user);
        toast.success(`Logged in ${result.user.name}`);
        navigate("/", { replace: true });
      } else {
        //setError(result.error);
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //register user
  const registerUser = async (userData) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();
      if (!result.error) {
        toast.success(
          "user registered successfully! Now Log into your account"
        );
        navigate("/login", { replace: true }); //replace: true: This option tells the routing library to replace the current entry in the navigation history with the new location instead of adding a new entry to the history stack.
        //By replacing the current entry in the navigation history instead of adding a new one, you maintain a cleaner history stack. This can be beneficial for user experience, as it prevents unnecessary clutter in the browser's back button history.
      } else {
        console.log(result);

        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
