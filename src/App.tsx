// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import UserLogin from './Auth/UserLogin';
import UserRegistration from './User/UserRegistration';
import Dashboard from './Dashboard';
import MyProfile from "./User/MyProfile";
import PrivateRoute from "./PrivateRoute";
import CreateProject from './components/CreateProject';

const App : React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    {/* Default route to the UserLogin component */}
                    <Route path="/" element={< UserLogin />}/>
                    <Route path="/register" element={< UserRegistration />}/>
                    <Route element={< PrivateRoute />}>
                        <Route path="/dashboard" element={< Dashboard />}/>
                        <Route path="/profile" element={< MyProfile onClose={() => console.log("Closed")} />} />
                        <Route path="/create-project" element={<CreateProject />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
