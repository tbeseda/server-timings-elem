<h1 align="center"><code>server-timings-elem</code> ⌚️</h1>

<p align="center">
  <strong>HTML custom element for displaying Server-Timing headers</strong><br>
  Display timers from the document request with <code>&lt;server-timings&gt;&lt;/server-timings&gt;</code>.<br>
  <a href="https://www.npmjs.com/package/server-timings-elem"><strong><code>server-timings-elem</code> on npmjs.com »</strong></a><br>
  <br>
  Contents:
  <a href="#Install">Install</a>
  •
  <a href="#Usage">Usage</a>
  •
  <a href="#Links">Links</a>
</p>

![Screenshot of server-timings-elem](./screenshot.png)

## Install

Get the `server-timings.js` file to your webpage.

Grab it from GitHub or via npm:

```sh
npm install server-timings-elem
```

## Usage

### HTML

Include the `<server-timings></server-timings>` element in your HTML document. The element will render as an unstyled `<ul>`.

```html
<server-timings></server-timings>
<server-timings log></server-timings>
<server-timings exclude="fast,cdn-*"></server-timings>
<server-timings sep=": "></server-timings>
<server-timings threshold="250"></server-timings>
<server-timings top="1"></server-timings>
```

#### Attributes

- `log` - Log the timings to the console as a table.
- `exclude` - Comma-separated list of names to exclude from the list.
  - Supports wildcard `*` at the end of a name.
- `sep` - Separator string to use between the name and duration.
- `threshold` - Minimum duration in ms to display.
- `top` - Number of greatest duration timings to display.

### JS API

`<server-timings>` will emit a `server-timings` event on itself after gathering, filtering, and sorting timings. The event's `detail` property will be a dictionary of the timings by name.

Also, the list of `PerformanceServerTiming` objects can be retrieved from the `timings` property.

```js
(function() {
  const $st = document.querySelector('server-timings#unique')
  $st.addEventListener('server-timings', ({ detail }) => {
    console.log('server-timings', detail)
    console.log($st.timings)
  })
})()
```

The event can be disabled with the `quiet` attribute.

### CSS

Sample CSS for styling the element:

```css
server-timings {
  display: block;
}
server-timings ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
}
```

## Links

[`header-timers`](https://npmjs.com/package/header-timers) - Node.js module for creating Server-Timing headers

[`Server-Timing` reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) MDN documentation on Server-Timing headers
