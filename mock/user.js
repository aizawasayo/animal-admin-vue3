export default [
  {
    url: '/api/getUsers',
    method: 'gett',
    response: ({ body }) => {
      console.log('body>>>>>>>>', body)
      return {
        code: 0,
        message: 'ok',
        data: ['Tom', 'Jerry'],
      }
    },
  },
  {
    url: '/api/createUser',
    method: 'post',
    response: ({ body }) => {
      console.log('body>>>>>>>>', body)
      return {
        code: 0,
        message: 'ok',
        data: null,
      }
    },
  },
]
