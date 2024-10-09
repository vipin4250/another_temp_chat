import React, { useEffect, useState } from 'react';
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('login'); // Default to 'login' tab
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if(user) {
      history.push('/chats');
    }
  }, [history]);

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '32rem' }}>
      <div className="bg-white rounded-md p-4 shadow-md">
        <h1 className="text-center mb-4" style={{ fontSize: '2.5rem', color: '#0a2540' }}>
          Let's Chat
        </h1>
        <ul className="nav nav-tabs" id="authTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
              id="login-tab"
              data-bs-toggle="tab"
              data-bs-target="#login"
              type="button"
              role="tab"
              aria-controls="login"
              aria-selected={activeTab === 'login'}
              style={{
                backgroundColor: activeTab === 'login' ? 'blue' : 'white',
                color: activeTab === 'login' ? 'white' : 'blue',
              }}
              onClick={() => handleTabClick('login')}
            >
              Log in
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
              id="signup-tab"
              data-bs-toggle="tab"
              data-bs-target="#signup"
              type="button"
              role="tab"
              aria-controls="signup"
              aria-selected={activeTab === 'signup'}
              style={{
                backgroundColor: activeTab === 'signup' ? 'blue' : 'white',
                color: activeTab === 'signup' ? 'white' : 'blue',
              }}
              onClick={() => handleTabClick('signup')}
            >
              Sign up
            </button>
          </li>
        </ul>
        <div className="tab-content" id="authTabContent">
          <div
            className={`tab-pane fade ${activeTab === 'login' ? 'show active' : ''}`}
            id="login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <Login />
          </div>
          <div
            className={`tab-pane fade ${activeTab === 'signup' ? 'show active' : ''}`}
            id="signup"
            role="tabpanel"
            aria-labelledby="signup-tab"
          >
            <SignUp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
