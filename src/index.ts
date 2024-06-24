import { BaseContext, Context } from 'koa'
import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
// import type {  } from '@types/koa'
const app = new Koa()

app
.use(bodyParser())
.use((ctx: Context) => {
    console.log(ctx.request)
    ctx.body = ctx.request.query || 'hello world'
})

app.listen(3196)