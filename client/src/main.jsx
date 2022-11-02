import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PlatformProvider } from "./context/PlatformContext";
import { AuthProvider } from "./context/AuthContext";
import MyTasks from "./routes/myTasks";
import Task from "./routes/task";
import Service from "./routes/service";
import NewTask from "./routes/newTask";
import NewService from "./routes/newService";
import Services from "./routes/services";
import Tasks from "./routes/tasks";
import Home from "./routes/home";

ReactDOM.render(
  <AuthProvider>
    <PlatformProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/new" element={<NewService />} />
            <Route path="tasks/:id" element={<Service />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/new" element={<NewTask />} />
            <Route path="tasks/:id" element={<Task />} />
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
