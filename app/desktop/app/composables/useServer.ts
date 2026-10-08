export const useServer = () => {
  const config = useRuntimeConfig();

  return config.public.apiUrl;
};
