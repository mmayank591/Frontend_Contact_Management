import React, { useContext, useEffect, useState } from "react";
import ToastContext from "../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
const EditContact = () => {
  const { id } = useParams(); // The useParams() hook is typically used to access parameters from the URL in a React component.
const navigate =useNavigate();
  const { toast } = useContext(ToastContext);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:8000/api/contact`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({id,...userDetails}),
    });
    const result = await res.json();
    if (!result.error) {
      toast.success(`Updated [${userDetails.name}] contact`);
      setUserDetails({ name: "", address: "", email: "", phone: "" });
      navigate("/mycontacts");
    } else {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/contact/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        setUserDetails({
          name: result.name,
          address: result.address,
          email: result.email,
          phone: result.phone,
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData(); // Call the async function inside useEffect
  
  }, []); // Empty dependency array to run the effect once on mount

  return (
    <>
      {loading ? (
        <Spinner splash="Loading Contact..." />
      ) : (
        <>
          {" "}
          <h2>Edit your Contact</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nameInput" className="form-label mt-4">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            </div>

            <div>
              <label htmlFor="emailInput" className="form-label mt-4">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div>
              <label htmlFor="addressInput" className="form-label mt-4">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="addressInput"
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
                placeholder="Delhi India"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneInput" className="form-label mt-4">
                Phone Number
              </label>
              <input
                type="number"
                className="form-control"
                id="phoneInput"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                placeholder="+91 1234567899"
                required
              />
            </div>
            <input
              type="submit"
              value="Save Changes"
              className="btn btn-info my-2"
            ></input>
          </form>
        </>
      )}
    </>
  );
};

export default EditContact;
