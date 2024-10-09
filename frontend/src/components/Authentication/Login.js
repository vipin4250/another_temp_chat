import axios from 'axios';
import { useState } from "react";
import { useHistory } from "react-router-dom";
// import { ChatState } from "../../Context/ChatProvider";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for show/hide password
import { ENDPOINT } from "../../config/variable";  // Adjust the path if necessary


/*************  ✨ Codeium Command ⭐  *************/
/******  6462f845-ed4d-4f8f-a831-5381e9f60ee7  *******/
const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  axios.defaults.withCredentials = true;


  // const ENDPOINT = "http://localhost:3000"; // Updated backend endpoint

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }
  
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
    
      const response = await axios.post(
        `${ENDPOINT}/api/user/login`,
        { email, password },
        config
      );
      
      console.log(response); // Add this to inspect the full response object
    
      const { data } = response;
    
      alert("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error); // Log the error to inspect it further
      alert(`Error occurred: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
    
  };
  

  return (
    <div className="container p-3">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card p-4" style={{ borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', transition: '0.3s' }}>
            <div className="card-body">
              <h3 className="text-center mb-4" style={{ color: '#0a2540' }}>Welcome Back!</h3>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="mb-1" style={{ fontWeight: 'bold', color: '#0a2540' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ transition: '0.3s', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="mb-1" style={{ fontWeight: 'bold', color: '#0a2540' }}>Password</label>
                  <div className="input-group">
                    <input
                      type={show ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ transition: '0.3s', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleClick}
                        style={{ borderRadius: '10px', backgroundColor: '#0a2540', color: 'white', transition: 'background-color 0.3s ease-in-out' }}
                      >
                        {show ? <FaEyeSlash /> : <FaEye />} {/* Toggle between icons */}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block mt-3"
                  onClick={submitHandler}
                  disabled={loading}
                  style={{ backgroundColor: '#0a2540', borderRadius: '10px', transition: 'transform 0.2s', fontWeight: 'bold' }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-block mt-3"
                  onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                  }}
                  style={{ borderRadius: '10px', transition: 'transform 0.2s', fontWeight: 'bold' }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                >
                  Get Guest User Credentials
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
