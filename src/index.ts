import { BaseContext, Context } from 'koa'
import Koa from 'koa'
import { koaBody } from 'koa-body'
import router from './router'

const app = new Koa()

app.use(koaBody())
// .use(async (ctx) => {
//     console.log(ctx.request, ctx.request.body)

//     ctx.body = 'got'
// })
app.use(router.routes()).use(router.allowedMethods())

app.listen(3196)