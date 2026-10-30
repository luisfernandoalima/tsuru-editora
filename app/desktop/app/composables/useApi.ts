export const useApi = () => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiUrl + "/api",
  });

  console.log(api);
  return api;
};
