import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetCategories } from "../../api/categories";

export const useFetchCategories = (params) => {
  const [progress, setProgress] = useState(0);

  const { isLoading, error, data } = useQuery({
    queryKey: ["categories", params],
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 6 * (60 * 1000), // 1 mins
    queryFn: async () => {
      const result = await GetCategories(params, (percent) => setProgress(percent));
      return result;
    },
  });
  return { isLoading, error, data, progress };
};
