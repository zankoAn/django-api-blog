import { useSearchParams, useNavigate } from "react-router-dom";

import "./pagination.css";

function* paginate(
  currentPage,
  totalPages,
  perPage,
  onEachSide = 2,
  onEnds = 1
) {
  const ELLIPSIS = "...";
  const num_pages = Math.ceil(totalPages / perPage);

  // If the total number of pages is less than or equal to the maximum visible pages
  if (num_pages <= (onEachSide + onEnds) * 2) {
    for (let i = 1; i <= num_pages; i++) {
      yield i;
    }
    return;
  }

  // If the current page is greater than the left limit
  if (currentPage > 1 + onEachSide + onEnds + 1) {
    // Show the first set of pages
    for (let i = 1; i <= onEnds; i++) {
      yield i;
    }
    yield ELLIPSIS;

    // Show the range around the current page
    for (let i = currentPage - onEachSide; i <= currentPage; i++) {
      yield i;
    }
  } else {
    // Show pages from the beginning to the current page
    for (let i = 1; i <= currentPage; i++) {
      yield i;
    }
  }

  // If the current page is less than the right limit
  if (currentPage < num_pages - onEachSide - onEnds - 1) {
    // Show the range after the current page
    for (let i = currentPage + 1; i <= currentPage + onEachSide; i++) {
      yield i;
    }
    yield ELLIPSIS;

    // Show the last set of pages
    for (let i = num_pages - onEnds + 1; i <= num_pages; i++) {
      yield i;
    }
  } else {
    // Show remaining pages from the current page to the end
    for (let i = currentPage + 1; i <= num_pages; i++) {
      yield i;
    }
  }
}

function Pagination({ totalArticles, perPage = 4 }) {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const currentPage = Number(
    queryParams.get("page") ? queryParams.get("page") : 1
  );

  let pageNumbers = [...paginate(currentPage, totalArticles, perPage)];
  if (pageNumbers.length >= 7) {
    pageNumbers = [...paginate(currentPage, totalArticles, perPage, 1, 1)];
  }

  if (pageNumbers.length < 2) return null;

  const handleApplyClick = (page) => {
    const newQueryParams = new URLSearchParams(queryParams);
    newQueryParams.delete('page');
    window.scrollTo({ top: 100, behavior: "smooth" });
    navigate(`/movies?page=${page}&${newQueryParams.toString().replace(/%2C/g, ',')}`);
  };

  const pages = () => {
    return pageNumbers.map((page, index) => (
      <span
        key={index}
        onClick={() => handleApplyClick(page)}
        className={page === currentPage ? "active-page" : "pages"}
      >
        {page}
      </span>
    ));
  };

  return <div className="pagination">{pages()}</div>;
}

export default Pagination;
