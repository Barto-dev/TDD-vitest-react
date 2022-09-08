import { rest } from 'msw'

export const handlers = [
  rest.post('/api/1.0/users', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
        email: 'test@email.com',
        username: 'username',
        password: 'password'
      })
    )
  }),
]
