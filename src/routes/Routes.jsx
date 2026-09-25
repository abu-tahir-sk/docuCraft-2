import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import DashboardHome from "../pages/DashboardHome";
import SavedDocuments from "../pages/SavedDocuments";
import DocumentEditor from "../components/DocumentEditor";
import ViewPdf from "../pages/ViewPdf";
import Profile from "../pages/Profile";
import Users from "../pages/Users";

export const router = createBrowserRouter([

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <Users />,
      },

      {
        path: "invoice",
        element: <DocumentEditor key="invoice" docType="invoice" />,
      },
      {
        path: "quotation",
        element: <DocumentEditor key="quotation" docType="quotation" />,
      },
      {
        path: "agreement",
        element: <DocumentEditor key="agreement" docType="agreement" />,
      },

      {
        path: "saved-documents",
        element: <SavedDocuments />,
      },
      {
        path: "view-pdf/:id",
        element: <ViewPdf />,
      },
      {
        path: "/dashboard/edit/:id",
        element: <DocumentEditor />,
      },


      {
        path: "settings",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },

]);