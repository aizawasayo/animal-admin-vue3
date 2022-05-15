import { getOptionList } from '@api/option'

export default function getOption(type, callback) {
  getOptionList({ type })
    .then(res => {
      const optionList = res.data.map(item => {
        return {
          text: item.name,
          value: item.name,
        }
      })
      callback(optionList)
    })
    .catch(err => {
      // console.log(err)
    })
}
