class ServerTimings extends HTMLElement {
  timings = []

  constructor () {
    super()
    this.$ul = this.appendChild(document.createElement('ul'))
  }

  gatherTimings(){
    let timings = []
    for (const entryType of ['navigation', 'resource'])
      for (const { serverTiming } of performance.getEntriesByType(entryType))
        if (serverTiming) timings = [...timings, ...serverTiming]

    return timings
  }

  connectedCallback () {
    const log = this.hasAttribute('log')
    const exclude = this.getAttribute('exclude')?.split(',') || []
    const topStr = this.getAttribute('top')
    const top = topStr ? parseInt(topStr) : Infinity
    const thresholdStr = this.getAttribute('threshold')
    const threshold = thresholdStr ? parseInt(thresholdStr) : 0
    const sep = this.getAttribute('sep') || ' '

    this.timings = this.gatherTimings()
      .filter(({ name }) => !exclude.includes(name))
      .filter(({ duration }) => duration >= threshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, top)

    this.$ul.innerHTML = this.timings
      .map(({ name, duration }) => `<li>${name}${sep}${duration} ms</li>`)
      .join('')

    if (log) {
      console.table(
        this.timings.reduce(
          (t, { name, description, duration }) => {
            t[name] = { description, duration: `${duration} ms` };
            return t;
          },
          {},
        )
      )
    }
  }
}

if ('customElements' in window)
  customElements.define('server-timings', ServerTimings)
