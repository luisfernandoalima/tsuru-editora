export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth();

  if (!user.value) {
    return navigateTo("/");
  }

  const perfil = getPerfil(user.value.funcao);

  if (perfil !== 1) {
    return navigateTo("/");
  }
});
