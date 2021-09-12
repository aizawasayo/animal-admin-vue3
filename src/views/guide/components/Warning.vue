<template>
  <aside>
    创建和编辑页面是不能被 keep-alive 缓存的，因为keep-alive 的 include 目前不支持根据路由来缓存，所以目前都是基于
    component name 来进行缓存的。如果你想类似的实现缓存效果，可以使用 localStorage 等浏览器缓存方案。或者不要使用
    keep-alive 的 include，直接缓存所有页面。详情见
    <a href="https://panjiachen.github.io/vue-element-admin-site/guide/essentials/tags-view.html" target="_blank"
      >Document</a
    >
  </aside>
</template>
