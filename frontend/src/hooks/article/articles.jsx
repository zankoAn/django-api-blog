import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { GetArticles, GetArticle } from "../../api/articles";

export const useFetchArticles = (queryParamsObject = {}) => {
  var progress = 0;
  const [queryParams] = useSearchParams();
  const params = {
    ...Object.fromEntries(queryParams.entries()),
    ...queryParamsObject,
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["articles", params],
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 6 * (60 * 1000), // 1 mins
    queryFn: async () => {
      const result = await GetArticles(params, (percent) => {
        progress = percent;
      });
      return result;
    },
  });

  return { isLoading, error, data, progress };
};

export const useFetchArticle = (article_id) => {
  var progress = 0;
  const { isLoading, error, data } = useQuery({
    queryKey: ["article", article_id],
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 6 * (60 * 1000), // 1 mins
    queryFn: async () => {
      const result = await GetArticle(article_id, (percent) => {
        progress = percent;
      });
      return result;
    },
  });

  return { isLoading, error, data, progress };
};
