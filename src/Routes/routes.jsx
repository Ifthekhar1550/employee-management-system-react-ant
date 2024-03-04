import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout/DashboardLayout";
import Admin from "../Pages/Dashboard/Admin/Admin.jsx"

export const routes = createBrowserRouter([

  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Admin/>,
      },
    ],
  },
]);
