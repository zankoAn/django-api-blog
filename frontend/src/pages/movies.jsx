import React from "react";
import Tape from "../components/base/TapeHead";

import { useFetchArticles } from "../hooks/article/articles";
import { MovieFilters } from "../components/article/filters";
import Pagination from "../components/article/pagination";
import CardArticle from "../components/article/card";
import LoadingBar from "../components/base/progress";
import ErrorMsg from "../components/base/error";

import "./movies.css";

function Movies() {
  const { isLoading, error, data, progress } = useFetchArticles({
    category_slug: "movies",
    order_by: "view_cnt",
    page_size: 5,
  });
  const articles = data?.results || [];
  const totalArticles = data?.count || 0;

  if (isLoading) {
    return <LoadingBar progress={progress} />;
  }

  if (error) {
    return <ErrorMsg message={error.message} />;
  }

  return (
    <>
      <section className="top-header-card movie">
      <Tape />
      </section>
      <div className="movie-content">
        <MovieFilters articles={articles} />
        <div className="posts">
          {articles.map((article, index) => (
            <div className="articles-wrapper" key={index}>
              <CardArticle article={article} />
            </div>
          ))}
        </div>
        <Pagination totalArticles={totalArticles} perPage={5} />
      </div>
    </>
  );
}

export default Movies;
