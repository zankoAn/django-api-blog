import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { GetUser } from "../../api/users";

export const useFetchUser = (user_id) => {
  const [progress, setProgress] = useState(0);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", user_id],
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 6 * (60 * 1000), // 1 mins
    queryFn: async () => {
      const result = await GetUser(user_id, (percent) => setProgress(percent));
      return result;
    },
  });

  return { isLoading, error, data, progress };
};
