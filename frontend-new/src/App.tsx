import DashboardLayout from "./components/layout/dashboard";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MoviesPage from "./screens/movies";
import '@fontsource-variable/figtree';
import MoviePage from "./screens/movie";
import AuthPage from "./screens/auth";
import UserProvider from "./providers/user";
import DashboardMoviesPage from "./screens/(dashboard)/movies";

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
          element: <div>Dashboard Home</div>
        }, {
          path: "movies",
          children: [
            {
              index: true,
              element: <DashboardMoviesPage />,
            },
            {
              path: 'new',
              element: <div >Dashboard New MOvie</div>,
            },
          ]
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
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
