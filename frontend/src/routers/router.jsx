import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Movies from "../pages/movies";
import Novels from "../pages/novels";
import AboutMe from "../pages/about";
import LastArtciles from "../pages/home";
import ListArticle from "../pages/programing";
import ArticleDetails from "../components/article/article";
import Page404 from "../components/base/404";
import App from "../App";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LastArtciles />,
      },
      {
        path: "/aboutMe/:user_id",
        element: <AboutMe />,
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/novels",
        element: <Novels />,
      },
      {
        path: "/articles",
        element: <ListArticle />,
      },
      {
        path: "/articles/:article_id",
        element: <ArticleDetails />,
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
]);

export default AppRouter;
