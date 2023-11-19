class ServerTimings extends HTMLElement {
  timings
  timingsTable

  constructor () {
    super()
    this.$ul = this.appendChild(document.createElement('ul'))
  }

  static get timings () { return this.timings }

  static get timingsTable () { return this.timingsTable }

  parseAttributes () {
    const log = this.hasAttribute('log')
    const quiet = this.hasAttribute('quiet')
    const exclude = this.getAttribute('exclude')?.split(',') || []
    const sep = this.getAttribute('sep') || ' '

    const topStr = this.getAttribute('top')
    const top = topStr ? parseInt(topStr) : Infinity

    const thresholdStr = this.getAttribute('threshold')
    const threshold = thresholdStr ? parseInt(thresholdStr) : 0

    const excludeSplat = exclude
      .filter(e => e.includes('*'))
      .map(e => e.replace('*', ''))

    return { log, quiet, exclude, excludeSplat, top, threshold, sep }
  }

  gatherTimings () {
    let timings = []
    for (const entryType of ['navigation', 'resource'])
      for (const { serverTiming } of performance.getEntriesByType(entryType))
        if (serverTiming) timings = [...timings, ...serverTiming]

    return timings
  }

  connectedCallback () {
    const { log, quiet, exclude, excludeSplat, top, threshold, sep } = this.parseAttributes()

    const timings = this.gatherTimings()
      .filter(({ name }) => !exclude.includes(name))
      .filter(({ name }) => !excludeSplat.some(e => name.startsWith(e)))
      .filter(({ duration }) => duration >= threshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, top)

    this.$ul.innerHTML = timings
      .map(({ name, duration }) => `<li><span>${name}${sep}</span><span>${duration} ms</span></li>`)
      .join('')

    const timingsTable = timings.reduce(
      (t, { name, description, duration }) => {
        t[name] = { description, duration: `${duration} ms` };
        return t;
      },
      {},
    )

    this.timings = timings
    this.timingsTable = timingsTable

    if (log) console.table(timingsTable)

    const event = new CustomEvent('server-timings', { detail: timingsTable, bubbles: true });
    if (!quiet) this.dispatchEvent(event);
  }
}

if ('customElements' in window)
  customElements.define('server-timings', ServerTimings)
