// a simple node server to create server timing headers and render a <server-timings> element

import http from 'node:http'
import { readFileSync } from 'node:fs'
import HeaderTimers from 'header-timers'

const port = 3000
const timers = HeaderTimers()

const server = http.createServer(async ({method, url}, res) => {
  if (method === 'GET' && url === '/server-timings.js') {
    res.setHeader('Content-Type', 'text/javascript')
    res.end(readFileSync('server-timings.js'))
    return
  }

  timers.start('server', 'Server things')
  timers.start('fast', 'Fast things')
  timers.stop('fast')
  await new Promise(resolve => setTimeout(resolve, 500))
  timers.start('db', 'DB things')
  await new Promise(resolve => setTimeout(resolve, 200))
  timers.stop('db')
  timers.start('api', 'API things')
  await new Promise(resolve => setTimeout(resolve, 300))
  timers.stop('api')
  timers.stop('server')

  res.setHeader('Content-Type', 'text/html')
  res.setHeader(timers.key, timers.value())

  res.end(/*html*/`
    <!doctype html>
    <html>
      <head>
        <title>Server Timings Elem</title>
        <script type="module" src="server-timings.js"></script>
        <style>
          body {
            font-family: sans-serif;
            margin: 0 auto;
            max-width: 50rem;
          }
          hr {
            border: none;
            border-top: 1px solid #ccc;
          }
          code {
            background: #eee;
            padding: 0.25rem;
          }

          server-timings#styled {
            display: block;
            padding: 1rem;
            font-family: monospace;
            color: cornflowerblue;
          }
          server-timings#styled ul {
            margin: 0;
            padding: 0;
            list-style: none;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
          }
          server-timings#styled li {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <h1>Server Timings Elem</h1>
        <hr>
        <p>Base element checks for and displays all server timing entries as an unordered list.</p>
        <pre><code>&lt;server-timings&gt;&lt;/server-timings&gt;</code></pre>
        <server-timings></server-timings>
        <hr>
        <p>Enable console log of timings. Exclude the "fast" and "server" entries.</p>
        <p><small>Open the devtools to see the server timings log.</small></p>
        <pre><code>&lt;server-timings log exclude="fast,server"&gt;&lt;/server-timings&gt;</code></pre>
        <server-timings log exclude="fast,server"></server-timings>
        <hr>
        <p>Custom styles.</p>
        <pre><code>&lt;server-timings id="styled"&gt;&lt;/server-timings&gt;</code></pre>
        <server-timings id="styled"></server-timings>
      </body>
    </html>
  `)
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
