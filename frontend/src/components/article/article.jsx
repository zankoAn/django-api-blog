import React from "react";
import { useParams } from "react-router-dom";

import { useFetchArticle } from "../../hooks/article/articles";
import LoadingBar from "../base/progress";
import ErrorMsg from "../base/error";

import "./article.css";

function ArticleDetails() {
  let { article_id } = useParams();
  const { isLoading, error, data, progress } = useFetchArticle(article_id);
  const article = data || {};
  window.scrollTo({ top: 40, behavior: "smooth" });

  return (
    <div className="article">
      {isLoading && <LoadingBar progress={progress} />}
      {error && <ErrorMsg message={error.message} />}
      <h2>{article.title}</h2>
      <img src={article.cover} alt="" />
      <span>{article.body}</span>
    </div>
  );
}

export default ArticleDetails;
