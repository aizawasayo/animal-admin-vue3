export default function useFilter(listQuery) {
  const filterChange = filters => {
    const defaultKeys = ['query ', 'page', 'pageSize', 'sort', 'sortJson']
    // 是否重置筛选条件
    const isReset = !Object.keys(filters).length
    if (isReset) {
      Object.keys(listQuery).forEach(key => {
        if (!defaultKeys.includes(key)) {
          delete listQuery[key]
        }
      })
      return
    }

    // Object.assign(listQuery, filters)
    Object.keys(filters).forEach(key => {
      listQuery[key] = filters[key]
    })
  }
  return {
    filterChange,
  }
}
