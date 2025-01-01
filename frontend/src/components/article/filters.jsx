import React, { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useFetchCategories } from "../../hooks/article/categories";
import ErrorMsg from "../base/error";
import LoadingBar from "../base/progress";

import "./filters.css";

export function MovieFilters({ articles }) {
  // Hook setup
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const genre_param = { parent: "movies", page_size: 20 };
  const category_param = { parent: "country-categories", page_size: 20 };
  const { isPending, error, data, progress } = useFetchCategories(genre_param);
  const {
    isPending: isPendingC,
    error: errorC,
    data: dataC,
    progress: progressC,
  } = useFetchCategories(category_param);

  // State management
  const [selected_year, setYear] = useState(
    queryParameters.get("published")
      ? queryParameters.get("published").split("-")[0]
      : ""
  );
  const [selected_month, setMonth] = useState(
    queryParameters.get("published")
      ? queryParameters.get("published").split("-")[1]
      : ""
  );
  const [selected_categories, setSelectedCategories] = useState(
    queryParameters.get("categories")
      ? queryParameters.get("categories").split(",")
      : []
  );
  const [selected_countries, setSelectedCountry] = useState(
    queryParameters.get("c_type")
      ? queryParameters.get("c_type").split(",")
      : []
  );
  const [selected_tags, setSelectedTags] = useState(
    queryParameters.get("tags") ? queryParameters.get("tags").split(",") : []
  );

  const genres = data?.results || [];
  const categories = dataC?.results || [];
  const uniqueTags = [...new Set(articles.flatMap((article) => article.tags))];

  // Generate years from 2020 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  );

  // Event handlers
  const handleTagFilterClick = (filter) => {
    setSelectedTags((prevSelectedFilters) => {
      if (prevSelectedFilters.includes(filter)) {
        return prevSelectedFilters.filter((item) => item !== filter);
      } else {
        return [...prevSelectedFilters, filter];
      }
    });
  };
  const handleCategoryFilterClick = (filter) => {
    setSelectedCategories((prevSelectedFilters) => {
      if (prevSelectedFilters.includes(filter)) {
        return prevSelectedFilters.filter((item) => item !== filter);
      } else {
        return [...prevSelectedFilters, filter];
      }
    });
  };
  const handleDateFilterClick = (e) => {
    const { name, value } = e.target;
    if (name === "month") {
      setMonth(value);
    } else if (name === "year") {
      setYear(value);
    }
  };
  const handleCountryFilterClick = (filter) => {
    setSelectedCountry((prevSelectedFilters) => {
      if (prevSelectedFilters.includes(filter)) {
        return prevSelectedFilters.filter((item) => item !== filter);
      } else {
        return [...prevSelectedFilters, filter];
      }
    });
  };
  // Query generation
  const generateQueryString = () => {
    const tagQuery =
      selected_tags.length > 0 ? `tags=${selected_tags.join(",")}` : "";
    const categoryQuery =
      selected_categories.length > 0
        ? `categories=${selected_categories.join(",")}`
        : "";

    const CountryQuery =
      selected_countries.length > 0
        ? `c_type=${selected_countries.join(",")}`
        : "";

    const yearQuery = selected_year ? `published=${selected_year}` : "";
    const finalYear = selected_year || (selected_month ? currentYear : "");
    const dateQuery = selected_month
      ? `published=${finalYear}-${selected_month}`
      : "";
    const finalDateQuery =
      selected_year && !selected_month ? yearQuery : dateQuery;

    return [tagQuery, categoryQuery, finalDateQuery, CountryQuery]
      .filter(Boolean)
      .join("&");
  };
  //  Apply/Remove filters
  const handleApplyClick = () => {
    const scrollToValue = window.innerHeight <= 768 ? 300 : 100;
    window.scrollTo({ top: scrollToValue });
    const queryString = generateQueryString();
    navigate(`/movies?${queryString}`);
  };
  const handleRemoveFilterClick = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
    setYear("");
    setMonth("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedCountry([]);
    navigate(`/movies`);
  };

  const HandleShowFilterClick = () => {
    const filter = document.querySelector(".filters");
    if (filter.style.display === "flex") {
      filter.style.display = "none";
    } else {
      filter.style.display = "flex";
    }
  };

  return (
    <>
      <div onClick={HandleShowFilterClick} className="show-filters">
        <span>نمایش فیلتر ها</span>
      </div>
      <div className="filters">
        {isPending ||
          (isPendingC && <LoadingBar progress={progress || progressC} />)}
        {error || (errorC && <ErrorMsg message={error.message} />)}
        <div className="categories">
          <hr></hr>
          <h1>انتخاب کشور</h1>
          <div className="items">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCountryFilterClick(String(category.id))}
                className="checkbox-container"
              >
                <span
                  key={index}
                  style={{
                    backgroundColor: selected_countries.includes(
                      String(category.id)
                    )
                      ? "#ff9292"
                      : "#f0f0f0",
                  }}
                  className="checkmark"
                ></span>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="genres">
          <h1>انتخاب ژانر</h1>
          <div className="items">
            {genres.map((genre, index) => (
              <span
                className={
                  selected_categories.includes(String(genre.id))
                    ? "active"
                    : "deactive"
                }
                onClick={() => handleCategoryFilterClick(String(genre.id))}
                key={index}
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
        <div className="tags">
          <h1>تگ ها</h1>
          <div className="items">
            {uniqueTags.map((tag, index) => (
              <span
                className={selected_tags.includes(tag) ? "active" : "deactive"}
                onClick={() => handleTagFilterClick(tag)}
                key={index}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="date">
          <h1>تاریخ انتشار</h1>
          <div className="items">
            <select
              name="year"
              value={selected_year}
              onChange={handleDateFilterClick}
            >
              <option value="">انتخاب سال</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="month"
              value={selected_month}
              onChange={handleDateFilterClick}
            >
              <option value="">انتخاب ماه</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="actions">
          <div onClick={handleApplyClick} className="apply">
            <span>اعمال فیلتر ها</span>
          </div>
          <div onClick={handleRemoveFilterClick} className="remove">
            <span>پاک کردن همه</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function BookFilters({ books }) {
  // Hook setup
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();

  // State management
  const [selected_authors, setSelectedAuthors] = useState(
    queryParameters.get("authors")
      ? queryParameters.get("authors").split(",")
      : []
  );
  const [selected_tags, setSelectedTags] = useState(
    queryParameters.get("tags") ? queryParameters.get("tags").split(",") : []
  );

  const category_param = { parent: "book-authors", page_size: 20 };
  const { isPending, error, data, progress } =
    useFetchCategories(category_param);

  const authors = data?.results || [];
  const uniqueTags = [...new Set(books.flatMap((article) => article.tags))];

  // Event handlers
  const handleTagFilterClick = (filter) => {
    setSelectedTags((prevSelectedFilters) => {
      if (prevSelectedFilters.includes(filter)) {
        return prevSelectedFilters.filter((item) => item !== filter);
      } else {
        return [...prevSelectedFilters, filter];
      }
    });
  };
  const handleAuthorFilterClick = (filter) => {
    setSelectedAuthors((prevSelectedFilters) => {
      if (prevSelectedFilters.includes(filter)) {
        return prevSelectedFilters.filter((item) => item !== filter);
      } else {
        return [...prevSelectedFilters, filter];
      }
    });
  };

  // Query generation
  const generateQueryString = () => {
    const tagQuery =
      selected_tags.length > 0 ? `tags=${selected_tags.join(",")}` : "";
    const authorQuery =
      selected_authors.length > 0 ? `parent=${selected_authors.join(",")}` : "";
    return [tagQuery, authorQuery].filter(Boolean).join("&");
  };

  //  Apply/Remove filters
  const handleApplyClick = () => {
    const scrollToValue = window.innerHeight <= 768 ? 300 : 100;
    window.scrollTo({ top: scrollToValue });
    const queryString = generateQueryString();
    navigate(`/novels?${queryString}`);
  };

  const handleRemoveFilterClick = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
    setSelectedAuthors([]);
    setSelectedTags([]);
    navigate(`/novels`);
  };

  const HandleShowFilterClick = () => {
    const filter = document.querySelector(".filters");
    if (filter.style.display === "flex") {
      filter.style.display = "none";
    } else {
      filter.style.display = "flex";
    }
  };

  return (
    <>
      <div onClick={HandleShowFilterClick} className="show-filters">
        <span>نمایش فیلتر ها</span>
      </div>
      <div className="filters">
        {isPending ||
          (isPendingC && <LoadingBar progress={progress || progressC} />)}
        {error || (errorC && <ErrorMsg message={error.message} />)}
        <div className="categories">
          <hr></hr>
          <h1>انتخاب نویسنده</h1>
          <div className="items">
            {authors.map((author, index) => (
              <div
                key={index}
                onClick={() => handleAuthorFilterClick(author.id)}
                className="checkbox-container"
              >
                <span
                  key={index}
                  style={{
                    backgroundColor: selected_authors.includes(author.id)
                      ? "#ff9292"
                      : "#f0f0f0",
                  }}
                  className="checkmark"
                ></span>
                <span>{author.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="tags">
          <h1>تگ ها</h1>
          <div className="items">
            {uniqueTags.map((tag, index) => (
              <span
                className={selected_tags.includes(tag) ? "active" : "deactive"}
                onClick={() => handleTagFilterClick(tag)}
                key={index}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="actions">
          <div onClick={handleApplyClick} className="apply">
            <span>اعمال فیلتر ها</span>
          </div>
          <div onClick={handleRemoveFilterClick} className="remove">
            <span>پاک کردن همه</span>
          </div>
        </div>
      </div>
    </>
  );
}
