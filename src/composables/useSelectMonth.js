import { inject, reactive } from 'vue'

export default function useSelectMonth(formData) {
  const monthList = inject('monthList')

  const oldOptions = reactive({
    north: [],
    south: [],
  })

  const selectAll = (val, prop) => {
    const allValues = []
    for (const item of monthList) {
      allValues.push(item.value)
    }
    const oldVal = oldOptions[prop].length === 0 ? [] : oldOptions[prop][1]
    if (val.includes('全年')) formData.activeTime[prop] = allValues
    if (oldVal.includes('全年') && !val.includes('全年'))
      formData.activeTime[prop] = []
    if (oldVal.includes('全年') && val.includes('全年')) {
      const index = val.indexOf('全年')
      val.splice(index, 1)
      formData.activeTime[prop] = val
    }
    if (!oldVal.includes('全年') && !val.includes('全年')) {
      if (val.length === allValues.length - 1)
        formData.activeTime[prop] = ['全年'].concat(val)
    }
    oldOptions[prop][1] = formData.activeTime[prop]
  }

  return {
    monthList,
    selectAll,
  }
}
