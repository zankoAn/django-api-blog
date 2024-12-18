import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import loadingImg from "../../assets/home/not-load.webp";
import "./card.css";

const LoadCover = ({ article }) => {
  const [loading, setIsLoading] = useState(true);
  const [LoadingError, setErrorLoading] = useState(false);

  return (
    <>
      {loading && !LoadingError && (
        <div className="item loading">
          <span>کاور لودینگ</span>
        </div>
      )}
      <div className={loading ? "test" : "frame"}>
        <img
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setErrorLoading(true);
            setIsLoading(false);
          }}
          src={LoadingError ? loadingImg : article.cover}
          loading="eager"
          alt={article.title}
          style={{
            display: loading ? "none" : "block",
            maxWidth: LoadingError ? "120px" : "180px",
          }}
        />
      </div>
    </>
  );
};
import { useNavigate } from "react-router-dom";

function CardArticle({ article }) {
  const navigate = useNavigate();

  return (
    <NavLink className="articles" to={`/articles/${article.id}`}>
      <span className="card-pin simple"></span>
      <LoadCover article={article} />
      <span
        className="user"
        role="link"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate(`/aboutMe/${article.author}`);
        }}
      >
        {article.author === 1 ? "zankoAn...;" : "Others"}
      </span>
      <span className="title">{article.title}</span>
      <div className="read-time">
        خواندن {Math.ceil(article.body.trim().split(" ").length / 200)} دقیقه
      </div>
      <div className="tags">
        {article.tags.map((tag, index) => (
          <span
            key={index}
            className="tag"
            id={`tag-${index}`}
            role="link"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(`/movies/?tags=${tag}`);
            }}
          >
            {tag}
            <span>#</span>
          </span>
        ))}
      </div>
      <span className="summary">{article.summary}</span>
      <span className="card-pin simple"></span>
    </NavLink>
  );
}

export default CardArticle;
