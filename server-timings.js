class ServerTimings extends HTMLElement {
  timings = {}

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

    this.timings = this.gatherTimings().filter(({ name }) => !exclude.includes(name))

    this.$ul.innerHTML = this.timings
      .map(({ name, duration }) => `<li>${name} ${duration} ms</li>`)
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
