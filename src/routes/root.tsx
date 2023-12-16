
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PersonView from "../components/person/PersonView";
import Landing from "../components/Landing";
import MovieView from "../components/movie/MovieView";
import PersonEdit from "../components/person/PersonEdit";
import MovieEdit from "../components/movie/MovieEdit";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <>Ruta Invalida</>,
    children: [
      {
        path: "/",
        element: <Landing/> ,
        errorElement: <></>,
      },
      {
        path: "/person",
        element: <PersonView/> ,
        errorElement: <>Ruta Invalida</>,
      },{
        path: "/person/:id",
        element: <PersonEdit action="read"/> ,
        errorElement: <>Ruta Invalida</>,
      },{
        path: "/person/edit/:id",
        element: <PersonEdit action="edit"/> ,
        errorElement: <>Ruta Invalida</>,
      }
      ,{
        path: "/person/create",
        element: <PersonEdit  action="create"/> ,
        errorElement: <>Ruta Invalida</>,
      }, {
        path: "/movie",
        element: <MovieView/> ,
        errorElement: <></>,
      },{
        path: "/movie/edit/:id",
        element: <MovieEdit action="edit"/> ,
        errorElement: <>Ruta Invalida</>,
      },{
        path: "/movie/:id",
        element: <MovieEdit  action="read"/> ,
        errorElement: <>Ruta Invalida</>,
      },{
        path: "/movie/create",
        element: <MovieEdit  action="create"/> ,
        errorElement: <>Ruta Invalida</>,
      }
    ],
  },
]);

export default BrowserRouter;
