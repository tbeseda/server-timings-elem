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
            background: #efefef;
          }
          pre, ul {
            margin: 0;
          }
          code {
            padding: 0.25rem;
            border-radius: 0.25rem;
            background: #fff;
          }

          example-output {
            max-width: 45rem;
            margin: 0 auto 1rem auto;
            padding: 1.5rem;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
            display: grid;
            grid-template-columns: 25rem 1fr;
            gap: 1rem;
          }
          example-output.wide {
            grid-template-columns: 1fr;
          }
          example-output pre code {
            background: #efefef;
            padding: 0.25rem;
            border-radius: 0.25rem;
          }

          server-timings#unique {
            display: block;
            padding: 1rem;
            font-family: monospace;
            color: cornflowerblue;
          }
          server-timings#unique ul {
            margin: 0;
            padding: 0;
            list-style: none;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem;
          }
          server-timings#unique li {
            border-right: 1px solid #ccc;
            padding-right: 0.75rem;
          }
          server-timings#unique li:last-child {
            border-right: none;
            padding-right: 0;
          }
        </style>
      </head>
      <body>
        <h1>Server Timings Elem</h1>
        <h2>Examples</h2>
        <h3>The original header string:</h3>
        <h4><code>${timers.value()}</code></h4>

        <p>
          Base element checks for, sorts, and displays all server timing entries as an unordered list. Also enable console log of timings.
          <small>Open the devtools to see the server timings log.</small>
        </p>
        <example-output>
          <pre><code>&lt;server-timings log&gt;&lt;/server-timings&gt;</code></pre>
          <server-timings log></server-timings>
        </example-output>

        <p>
          Exclude the "fast" and "server" entries.
          <small>("exclude" also applies to the log.)</small>
        </p>
        <example-output>
          <pre><code>&lt;server-timings exclude="fast,db"&gt;&lt;/server-timings&gt;</code></pre>
          <server-timings exclude="fast,db"></server-timings>
        </example-output>

        <p>List item formatting via "separator"</p>
        <example-output>
          <pre><code>&lt;server-timings sep=": "&gt;&lt;/server-timings&gt;</code></pre>
          <server-timings sep=": "></server-timings>
        </example-output>

        <p>Set a threshold of <code>N</code>ms.</p>
        <example-output>
          <pre><code>&lt;server-timings threshold="250"&gt;&lt;/server-timings&gt;</code></pre>
          <server-timings threshold="250"></server-timings>
        </example-output>

        <p>Show "top" slowest/longest <code>N</code> timing entries.</p>
        <example-output>
          <pre><code>&lt;server-timings top="1"&gt;&lt;/server-timings&gt;</code></pre>
          <server-timings top="1"></server-timings>
        </example-output>

        <p>Custom styles.</p>
        <example-output class="wide">
          <pre><code>&lt;server-timings id="unique"&gt;&lt;/server-timings&gt;</code></pre>
          <server-timings id="unique"></server-timings>
        </example-output>

        <script>
          (function() {
            const $st = document.querySelector('server-timings#unique')
            $st.addEventListener('server-timings', ({ detail }) => {
              console.log('server-timings', detail)
              console.log($st.timings)
            })
          })()
        </script>
      </body>
    </html>
  `)
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
