import { createBrowserRouter } from "react-router-dom";
import FormInput from "../Pages/FormInput";
import Home from "../Pages/Home";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/upload",
      element: <FormInput/>,
    },
  ]);

export default router;