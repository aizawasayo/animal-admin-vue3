// src/components/UserRepositories.vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div v-for="repositories">
      <div></div>
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import useUserRepositories from '@composables/useUserRepositories'
import useRepositoryNameSearch from '@composables/useRepositoryNameSearch'
import useRepositoryFilters from '@composables/useRepositoryFilters'
export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const { searchQuery, repositoriesMatchingSearchQuery } =
      useRepositoryNameSearch(repositories)

    const { filters, updateFilters, filteredRepositories } =
      useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters,
    }
  },
}
</script>
