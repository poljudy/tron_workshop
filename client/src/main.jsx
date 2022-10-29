import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { PlatformProvider } from "./context/PlatformContext";
import { AuthProvider } from "./context/AuthContext";
import MyTasks from "./routes/myTasks";
import Project from "./routes/project";
import "./index.css";
import NewProject from "./routes/new";
import NewProfile from "./routes/newProfile";
import Home from "./routes/home";

ReactDOM.render(
  <AuthProvider>
    <PlatformProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<MyTasks />} />
            <Route path="profile/new" element={<NewProfile />} />
            <Route path="new" element={<NewProject />} />
            <Route path=":id" element={<Project />} />
            <Route
              path="*"
              element={(
                <main className="text-white p-1 min-h-screen">
                  <h1 className="text-center">There is nothing here!</h1>
                </main>
              )}
            />
            <Route path="mytasks" element={<MyTasks />} />
          </Route>
        </Routes>
      </Router>
    </PlatformProvider>
  </AuthProvider>,
  document.getElementById("root")
);
