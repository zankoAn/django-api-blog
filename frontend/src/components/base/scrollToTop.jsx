import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(props) {
  const location = useLocation();
  useEffect(() => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      setTimeout(scrollToTop, 0);
      return () => {};
  }, [location]);

  return <>{props.children}</>;
}
