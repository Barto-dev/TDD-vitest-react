import { rest } from 'msw'

export const handlers = [
  rest.post('/api/1.0/users', async (req, res, ctx) => {
    const { username } = await req.json();
    if (!username) {
      return res(
        ctx.status(400),
        ctx.json({
          validationErrors: {
            username: 'Username cannot be null',
          },
        }),
      )
    }
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
