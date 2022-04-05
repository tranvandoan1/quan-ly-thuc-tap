import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutWebsite from "../layouts/layoutWebsite";
import Login from "../pages/login/Login";
import SupportStudent from "../pages/supportStudent/SupportStudent";
import ProactiveStudent from "../pages/proactiveStudent/ProactiveStudent";
import Privateroute from "./private/privateRoute";
import Status from "../pages/import-excel/Status";
import ReviewCV from "../pages/import-excel/ReviewCV";
import UpFile from "../pages/import-excel/UpFile";
import EmployeeManager from "../pages/employee-manager/Employee-Manager";
import InfoStudent from "../pages/InfoStudent/infoStudent";
import Privateadmin from "./private/privateAdmin";
import Notfound from "../pages/404/404";
const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Privateroute>
            <LayoutWebsite />
          </Privateroute>
        }
      >
        <Route path="/support-student" element={<SupportStudent />} />
        <Route path="/proactive-student" element={<ProactiveStudent />} />
        {/* <Route path="/support-student" element={<Proa
        <Route path="info-student" element={<InfoStudent />} />
        {/* admin */}
        <Route
          path="/employee-manager"
          element={
            <Privateadmin>
              <EmployeeManager />
            </Privateadmin>
          }
        />
        <Route
          path="status"
          element={
            <Privateadmin>
              <Status />
            </Privateadmin>
          }
        />
        <Route
          path="review-cv"
          element={
            <Privateadmin>
              <ReviewCV />
            </Privateadmin>
          }
        />
        <Route
          path="up-file"
          element={
            <Privateadmin>
              <UpFile />
            </Privateadmin>
          }
        />
        <Route path="/404" element={<Notfound />} />
      </Route>
    </Routes>
  );
};
export default Router;