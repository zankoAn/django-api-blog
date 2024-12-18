import React, { useState } from "react";
import { Link } from "react-router-dom";

import LoadingBar from "./progress";
import img from "../../assets/404/404.webp";
import img1 from "../../assets/404/404-1.webp";
import img2 from "../../assets/404/404-2.webp";
import img3 from "../../assets/404/404-3.webp";
import img4 from "../../assets/404/404-4.webp";
import img5 from "../../assets/404/404-5.webp";
import img6 from "../../assets/404/404-6.webp";
import img7 from "../../assets/404/404-7.webp";

import "./404.css";

const images = [
  {
    src: img,
    id: "e0",
    alt: "Shinei Nouzen",
    dialog: "آینده برای کسی مثل من خیلی طولانیه...",
  },
  {
    src: img1,
    id: "e1",
    alt: "Makoto Yuki",
    dialog: "هیچی اینجا نیست، حتی امید!",
  },
  {
    src: img2,
    id: "e2",
    alt: "Arthur Boyle",
    dialog: "این صفحه گم شده، مثل رویا هامون...",
  },
  {
    src: img3,
    id: "e3",
    alt: "Shinpei Ajiro",
    dialog: "اگه این اخرین چیزیه که میبینم، پس شاید مردن هم اونقدرا بد نباشه.",
  },
  {
    src: img4,
    id: "e4",
    alt: "mikasa ackerman",
    dialog: "شب بخیر رویاهای شیرین خداحافظ!",
  },
  {
    src: img5,
    id: "e5",
    alt: "Levi Ackerma",
    dialog: "اگر نمی‌جنگی، پس آماده باش که قربانی بشی",
  },
  {
    src: img6,
    id: "e6",
    alt: "Themis",
    dialog: "عدالت بدون قربانی، حتی قابل تصور نیست.",
  },
  {
    src: img7,
    id: "e7",
    alt: "Manga",
    dialog: "آیا کسی هست که در این دنیا، واقعاً درد مرا بفهمد؟",
  },
];

const LoadCover = ({ randomImage }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading && <LoadingBar progress={100} />}
      <img
        onLoad={() => setIsLoading(false)}
        src={randomImage.src}
        alt={randomImage.alt}
        className={`img-404 ${randomImage.id}`}
      />
    </>
  );
};

const Page404 = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  // const randomImage = Object({
  //     src: images[7].src,
  //     id: images[7].id,
  //     dialog: images[7].dialog,
  //     alt: images[7].alt,
  //   });
  window.scrollTo({ top: 40, behavior: "smooth" });
  return (
    <>
      <section className="top-header p404">
        <LoadCover randomImage={randomImage} />
        <h1 className={`title ${randomImage.id}`}>404</h1>
        <div className={`go-back ${randomImage.id}`}>
          <p className="msg">{randomImage.dialog}</p>
          <Link className="submit" to="/">
            بازگشت به واقعیت
          </Link>
        </div>
      </section>
    </>
  );
};

export default Page404;
