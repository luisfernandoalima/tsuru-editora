<script setup>
import { useAuthToken } from "~/composables/useAuthToken";

definePageMeta({
  middleware: "admin",
});

const { getToken } = useAuthToken();

const router = useRoute();
const api = useApi();

const token = getToken();

const id = router.params.id;

const response = await api(`/product/delete/${id}`, {
  method: "DELETE",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

console.log(response);

navigateTo("/");
</script>
