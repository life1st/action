import Router from '@koa/router'

const router = new Router()

router.post('/', async (ctx) => {
    console.log(ctx.request.body)

    ctx.body = 'ok'
}).post('/convert', async (ctx) => {
    console.log('convert', ctx.request.body, new Date().toString())

    ctx.body = 'ok'
})

export default router