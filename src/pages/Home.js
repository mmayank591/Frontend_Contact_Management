import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    !user && navigate("/login", { replace: true });
  }, []);

  return (
    <>
      <div className="jumbotron">
        <h1>Welcome {user ? user.name : null}</h1>

        <hr className="my-4" />

        <p className="lead">
          <a className="btn btn-info" href="#" role="button"  onClick={() => {
                  
                 navigate("/create", { replace: true });
                  }}>
            Add Contacts
          </a>
        </p>
      </div>
    </>
  );
};
export default Home;
