[See the live demo of this site!](https://rpglogs-api-sample-app.vercel.app/)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Then, the [RPGLogs API SDK](https://github.com/RPGLogs/RPGLogsApiSdk) was installed.

The default `/pages/api/hello.js` API endpoint was adjusted to `/pages/api/latestGuildReport.js`,
which uses the RPGLogs API SDK to find a guild.

The `/pages/index.js` page uses `fetch` to call this API endpoint.

Run `yarn dev` to start the local development server on [http://localhost:3000](http://localhost:3000).