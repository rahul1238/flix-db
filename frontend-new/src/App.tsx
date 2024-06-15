import DashboardLayout from "./components/layout/dashboard";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MoviesPage from "./screens/movies";
import '@fontsource-variable/figtree';
import MoviePage from "./screens/movie";
import AuthPage from "./screens/auth";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <MoviesPage />
      },
      {
        path: 'login',
        element: <AuthPage />
      },
      {
        path: ":id",
        element: <MoviePage />
      },
      {
        path: "dashboard",
        children: [{
          index: true,
          element: <div>Hello World</div>
        }, {
          path: '*',
          element: <div>not found</div>
        }],
        element: <DashboardLayout />
      },
    ]
  },

]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
