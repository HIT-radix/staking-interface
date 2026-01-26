import { useQuery } from "@tanstack/react-query";
import { getFormattedInvestmentsInfo } from "Utils/fetchers";

export const useGetFormattedInvestmentsInfo = () => {
  return useQuery({
    queryKey: ["investmentsInfo"],
    queryFn: getFormattedInvestmentsInfo,
  });
};
