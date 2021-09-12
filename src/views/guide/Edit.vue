<template>
  <guide-detail :is-edit="true" />
</template>

<script>
import GuideDetail from './components/GuideDetail'

export default {
  name: 'GuideEdit',
  components: { GuideDetail }
}
</script>
