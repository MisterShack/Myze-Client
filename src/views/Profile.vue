<template>
  <PageHeader>Profile</PageHeader>

  <form @submit.prevent="updateProfile">
    <FormField>
      <template #label>Email</template>
      <BaseInput :value="store.user.email" disabled />
    </FormField>

    <FormField>
      <template #label>Name</template>
      <BaseInput v-model="username" />
    </FormField>

    {{ username }}

    <input
      type="submit"
      :value="loading ? 'Saving...' : 'Update'"
      :disabled="loading"
    />
  </form>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import BaseInput from "@/components/forms/inputs/BaseInput.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";

  import { supabase } from "../supabase";
  import { store } from "../store";

  export default defineComponent({
    components: { BaseInput, FormField, PageHeader },
    setup() {
      const loading = ref(true);
      const username = ref("");
      const avatar_url = ref("");

      async function getProfile() {
        try {
          loading.value = true;
          store.user = supabase.auth.user();

          let { data, error, status } = await supabase
            .from("profiles")
            .select(`username, avatar_url`)
            .eq("id", store.user.id)
            .single();

          if (error && status !== 406) throw error;

          if (data) {
            username.value = data.username;
            avatar_url.value = data.avatar_url;
          }
        } catch (error) {
          alert(error.message);
        } finally {
          loading.value = false;
        }
      }

      async function updateProfile() {
        try {
          loading.value = true;
          store.user = supabase.auth.user();

          const updates = {
            id: store.user.id,
            username: username.value,
            avatar_url: avatar_url.value,
            updated_at: new Date(),
          };

          let { error } = await supabase.from("profiles").upsert(updates, {
            returning: "minimal",
          });

          if (error) throw error;
        } catch (error) {
          alert(error.message);
        } finally {
          loading.value = false;
        }
      }

      onMounted(() => {
        getProfile();
      });

      return {
        store,
        loading,
        username,
        avatar_url,
        updateProfile,
      };
    },
  });
</script>
