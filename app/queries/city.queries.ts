import {queryOptions} from "@tanstack/react-query";
import useListCity from "@/app/hooks/city/useListCity";
import {City} from "@/app/types/city";

export const citiesKey = {
  all: ["cities"] as const,
};

export const cityListQuery = () =>
  queryOptions<City[]>({
    queryKey: citiesKey.all,
    queryFn: () => useListCity(),
  });
