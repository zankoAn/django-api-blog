import { React } from "react";
import { Link } from "react-router-dom";

import { useFetchArticles } from "../hooks/article/articles";
import CardArticle from "../components/article/card";
import LoadingBar from "../components/base/progress";
import ErrorMsg from "../components/base/error";
import TopHeadLogo from "../assets/home/top-head-logo.svg";

import "./home.css";

function LastArtciles() {
  const { isLoading, error, data, progress } = useFetchArticles({
    order_by: "view-cnt",
  });
  const articles = data?.results || [];
  let year = 0;

  function IsNewYear({ new_year }) {
    if (new_year !== year) {
      year = new_year;
      return <h1 className="year">{year}</h1>;
    }
  }

  if (isLoading) {
    return <LoadingBar progress={progress} />;
  }

  if (error) {
    return <ErrorMsg message={error.message} />;
  }

  return (
    <>
      <section className="top-header-card home">
        <div className="heading">
          <img src={TopHeadLogo} loading="lazy" alt="logo" />
          <h1 className="title" id="t1">
            Ruthlеssness is mercy upon ourselvеs
          </h1>
          <h1 className="title" id="t2">
            we shall never surrender
          </h1>
          <h1 className="title" id="t3">
            Don’t let it rain on your parade
          </h1>
          <h1 className="title" id="t4">
            Chaos
          </h1>
          <h1 className="title" id="t5">
            폭풍 - 자유 - 신 - 실행하다
          </h1>
          <h1 className="title" id="t6">
          هیچ‌کس نمی‌تواند بی‌گناه باشد، حتی اگر تمام دنیا گناهکار باشد
          </h1>
          <h1 className="title" id="t7">
            내 영혼은 어떤 족쇄에도 갇히지 않는다
          </h1>
        </div>
        <div className="title-msg">
          <span>~ 😊 안녕 여러분 😊 ~</span>
        </div>
      </section>
      <div className="home-content">
        <div className="list-articles">
          {articles.map((article, index) => (
            <div className="articles-wrapper" key={index}>
              <div className="timeline">
                <IsNewYear new_year={new Date(article.created).getFullYear()} />
                <Link
                  className="month"
                  to={`/?published=${new Intl.DateTimeFormat(
                    "en-CA"
                  ).format(new Date(article.created))}`}
                >
                  {new Date(article.created).toLocaleString("default", {
                    day: "2-digit",
                    month: "long",
                  })}
                </Link>
              </div>
              <CardArticle article={article} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LastArtciles;
