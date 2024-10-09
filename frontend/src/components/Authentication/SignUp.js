import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password
import { useHistory } from "react-router";
import { ChatState } from "../../Context/ChatProvider"; // Import ChatState to access context
import { ENDPOINT } from "../../config/variable";  // Adjust the path if necessary


// const ENDPOINT = "http://localhost:3000"; // Updated backend endpoint

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const history = useHistory();
  const { setUser } = ChatState(); // Access setUser from ChatProvider

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  axios.defaults.withCredentials = true;


  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      alert("Please Fill all the Fields");
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      alert("Passwords Do Not Match");
      return;
    }
    console.log("register kar rha");
    
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${ENDPOINT}/api/user`,
        { name, email, password, pic },
        config
      );
      console.log("ye mera data h");
      console.log(data);
      alert("Registration Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data); // Update user in ChatProvider context
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      alert("Error Occurred!");
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please Select an Image!");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mern_chat_app");
      data.append("cloud_name", "dg0djyrja");
      fetch("https://api.cloudinary.com/v1_1/dg0djyrja/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      alert("Please Select an Image!");
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className="container p-3">
      <div className="row justify-content-center">
        <div className="col-md-full">
          <div className="card p-4" style={{ borderRadius: "15px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", transition: "0.3s" }}>
            <div className="card-body">
              <h3 className="text-center mb-4" style={{ color: "#0a2540" }}>Create an Account</h3>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="name" className="mb-1" style={{ fontWeight: "bold", color: "#0a2540" }}>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                    style={{ transition: "0.3s", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="mb-1" style={{ fontWeight: "bold", color: "#0a2540" }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ transition: "0.3s", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="mb-1" style={{ fontWeight: "bold", color: "#0a2540" }}>Password</label>
                  <div className="input-group">
                    <input
                      type={show ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ transition: "0.3s", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleClick}
                        style={{ borderRadius: "10px", backgroundColor: "#0a2540", color: "white", transition: "background-color 0.3s ease-in-out" }}
                      >
                        {show ? <FaEyeSlash /> : <FaEye />} {/* Toggle between icons */}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="confirmpassword" className="mb-1" style={{ fontWeight: "bold", color: "#0a2540" }}>Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={show ? "text" : "password"}
                      className="form-control"
                      id="confirmpassword"
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmpassword(e.target.value)}
                      style={{ transition: "0.3s", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleClick}
                        style={{ borderRadius: "10px", backgroundColor: "#0a2540", color: "white", transition: "background-color 0.3s ease-in-out" }}
                      >
                        {show ? <FaEyeSlash /> : <FaEye />} {/* Toggle between icons */}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="pic" className="mb-1" style={{ fontWeight: "bold", color: "#0a2540" }}>Upload your Picture</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="pic"
                    onChange={(e) => postDetails(e.target.files[0])}
                    style={{ transition: "0.3s", borderRadius: "10px" }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block mt-3"
                  onClick={submitHandler}
                  disabled={picLoading}
                  style={{ backgroundColor: "#0a2540", borderRadius: "10px", transition: "transform 0.2s", fontWeight: "bold" }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {picLoading ? "Loading..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
