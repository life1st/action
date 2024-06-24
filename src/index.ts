import { BaseContext, Context } from 'koa'
import Koa from 'koa'
// import type {  } from '@types/koa'
const app = new Koa()

app.use((ctx: Context) => {
    console.log(ctx.request)
    ctx.body = ctx.request.query || 'hello world'
})

app.listen(3196)