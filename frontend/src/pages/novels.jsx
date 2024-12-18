import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { BookFilters } from "../components/article/filters";
import { useFetchArticles } from "../hooks/article/articles";
import LoadingBar from "../components/base/progress";
import ErrorMsg from "../components/base/error";
import Pagination from "../components/article/pagination";
import akraman1 from "../assets/novel/akraman1.webp";
import akraman2 from "../assets/novel/akraman2.webp";
import gost from "../assets/novel/gost.webp";
import book1 from "../assets/novel/book1.webp";
import book2 from "../assets/novel/book2.webp";

import "./novels.css";

const LoadCover = ({ book }) => {
  const [loading, setLoading] = useState(true);
  const [LoadingError, setErrorLoading] = useState(false);

  return (
    <>
      {loading && !LoadingError && (
        <div className="loading">
          <span>کاور لودینگ</span>
        </div>
      )}
      <img
        onLoad={() => setLoading(false)}
        onError={() => {
          setErrorLoading(true);
          setLoading(false);
        }}
        src={LoadingError ? "./not-load.webp" : book.cover}
        loading="eager"
        alt={book.title}
        className="cover"
      />
    </>
  );
};

function Novels() {
  const { isLoading, error, data, progress } = useFetchArticles({
    c_type: "books",
    page_size: 15,
    order_by: "ignore_position",
  });

  const totalArticles = data?.count || 0;
  const books = data?.results || [];

  useEffect(() => {
    var list_books = document.querySelectorAll(".book-front");
    var left_pages = document.querySelectorAll(
      ".main-left-page, .first-page, .first-page2"
    );

    left_pages.forEach((book) => {
      book.onclick = function () {
        if (book.parentNode.parentNode.classList.contains("flipped")) {
          book.parentNode.parentNode.classList.remove("flipped");
          var summary = book.querySelector(".summary");
          var title = book.querySelector(".titl");
          if (!summary && !title) {
            const parent = book.parentNode.querySelector(".main-left-page");
            summary = parent.querySelector(".summary");
            title = parent.querySelector(".titl");
          }
          summary.style.display = "none";
          title.style.display = "none";
        }
      };
    });

    list_books.forEach((book) => {
      var active_book = 0;
      book.onclick = function () {
        if (book.parentNode.classList.contains("flipped")) {
          book.parentNode.classList.remove("flipped");
          book.nextSibling.querySelector(".summary").style.display = "none";
          book.nextSibling.querySelector(".titl").style.display = "none";
        } else {
          book.parentNode.classList.add("flipped");
          active_book = book;
          book.parentNode.querySelector(".summary").style.display = "block";
          book.parentNode.querySelector(".titl").style.display = "block";
        }
        list_books.forEach((book) => {
          if (book.parentNode.id !== active_book.parentNode.id) {
            book.parentNode.classList.remove("flipped");
            book.parentNode.querySelector(".summary").style.display = "none";
            book.parentNode.querySelector(".titl").style.display = "none";
          }
        });
      };
    });
  }, [data?.results]);

  const metadataTranslation = {
    author: "نویسنده",
    total_read_chapter: "آخرین چپتری که خوندم",
    total_chapter: "تعداد فعلی چپتر ها",
    status: "وضعیت",
  };

  if (isLoading) {
    return <LoadingBar progress={progress} />;
  }

  if (error) {
    return <ErrorMsg message={error.message} />;
  }

  return (
    <>
      <section className="top-header-card novel">
        <img src={akraman2} className="akraman-right" alt="novel" />
        <img src={gost} className="gost" alt="novel" />
        <img src={akraman1} className="akraman-left" alt="novel" />
        <img src={book1} className="book1" alt="novel" />
        <img src={book2} className="book2" alt="novel" />
        <h1>بهترین ناول هایی که خوندم</h1>
      </section>
      <div className="novel-content">
        <BookFilters books={books} />
        <div className="content">
          {books.map((book, index) => (
            <div className="book" id={index} key={index}>
              <div className="book-front">
                <div className="avatar">
                  <p className="title-book">{book.title}</p>
                  <LoadCover book={book} />
                </div>
                <div className="last"></div>
              </div>
              <div className="book-pages">
                <div className="last-page"></div>
                <div className="main-right-page">
                  <span className="title">{book.title}</span>
                  {Object.keys(metadataTranslation).map(
                    (key) =>
                      book.metadata[key] !== undefined && (
                        <span className="metadata" key={key}>
                          <span className="key">
                            {metadataTranslation[key]}:
                          </span>
                          <span className="value">{book.metadata[key]}</span>
                        </span>
                      )
                  )}
                </div>
                <div className="main-left-page">
                  <p className="titl" style={{ display: "none" }}>
                    خلاصه
                  </p>
                  <span className="summary" style={{ display: "none" }}>
                    {book.summary}
                  </span>
                  {book.tags.map((tag, index) => (
                    <Link
                      style={{ top: (index + 1) * 30 + "px" }}
                      key={index}
                      className="tag"
                      id={`tag-${index}`}
                      to={`/novels/?tags=${tag}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {tag}
                    </Link>
                  ))}
                  <Link
                    style={{ top: "220px", display: "none" }}
                    id={`tag-${index}`}
                    to={`/articles/${book.id}`}
                    className="show-post"
                  >
                    جزئیات بیشتر؟
                  </Link>
                </div>
                <div className="first-page"></div>
                <div className="first-page2"></div>
              </div>
              <div className="book-back"></div>
            </div>
          ))}
        </div>
        <Pagination totalArticles={totalArticles} perPage={10} />
      </div>
    </>
  );
}

export default Novels;
