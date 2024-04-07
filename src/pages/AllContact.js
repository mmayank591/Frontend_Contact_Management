import React, { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import Modal from "react-bootstrap/Modal";
import ToastContext from "../context/ToastContext";
import { Link } from "react-router-dom";
const AllContact = () => {
  const { toast } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/mycontacts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.contacts);
          setLoading(false);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData(); // Call the async function immediately
  }, []); // Empty dependency array since this effect doesn't depend on any props or state

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure  you want to Delete this contact?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.myContacts);
          toast.success("Deleted contact");
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (error) {}
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const newSearchUser = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setContacts(newSearchUser); //TO DISPLAY THE SEARCEHED CONTACT
  };

  return (
    <>
      <div className="jumbotron">
        <div className="container d-flex justify-content-between"  >
        <h1>Your Contacts</h1>
        <a
      href="/mycontacts"
      className="btn btn-danger my-1"
      style={{ marginTop: '2px' }} // Correct inline style syntax
    >
      Reload Contacts
    </a>
        </div>
        <hr className="my-4" />

        {loading ? (
          <Spinner splash="Loading Contacts...." />
        ) : (
          <>
            {contacts.length == 0 ? (
              <h3>No Contacts Created yet</h3>
            ) : (
              <>
                <form className="d-flex" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    name="searchInput"
                    id="searchInput"
                    className="form-control my-2"
                    placeholder="Search Contact"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-info mx-2"  style={{ height: '50px', width: '150px' }}>
                    Search
                  </button>
                </form>
                <p>Your Total Contacts :{contacts.length}</p>
                <table className="table table-hover">
                  <thead>
                    <tr className="table-dark">
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        onClick={() => {
                          setModalData({}); //IF WE SWITCH FROM ONE MODAL TO ANOTHER MODAL WE NEED TO FIRST CLEAR THE PREVIOUS DATA
                          setModalData(contact);
                          setShowModal(true);
                        }}
                      >
                        <th scope="row">{contact.name}</th>
                        <td>{contact.address}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
      {/* The show prop is set to the value of showModal, which controls the visibility of the modal based on whether it's true or false. */}

      {/* The onHide={() => setShowModal(false)} prop is set to a function that sets showModal to false when the modal is closed either by clicking on the close button or outside the modal. */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3>{modalData.name}</h3>
          <p>
            {" "}
            <strong>Address</strong>:{modalData.address}
          </p>
          <p>
            <strong>Email</strong>:{modalData.email}
          </p>
          <p>
            <strong>Phone Number</strong>:{modalData.phone}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Link className="btn btn-info" to={`/edit/${modalData._id}`}>
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => deleteContact(modalData._id)}
          >
            Delete
          </button>
          <button
            className="btn btn-warning"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AllContact;
