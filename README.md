# AcceDe Web - accordion

WAI-ARIA accordion plugin without dependencies.

## Requirements

### HTML

Basic HTML structure with a heading containing a button and the element to display. Headings can be any `hx` from `h1` to `h6` or an element with `role="heading"` and `aria-level` attributes. The headings and panels must be enclosed in a common element used to initiate the script. `aria-controls` attribute can be replaced with `data-controls` if necessary.

#### HTML structure

```html
<div class="accordion">
  <h3>
    <button id="tab1" aria-controls="panel1">Entête n<sup>o</sup> 1</button>
  </h3>
  <div id="panel1" aria-labelledby="tab1" aria-hidden="false">
    <p>---</p>
  </div>
  <h3>
    <button id="tab2" aria-controls="panel2" >Entête n<sup>o</sup> 2</button>
  </h3>
  <div id="panel2" aria-labelledby="tab2">
    <p>---</p>
  </div>
  <h3>
    <button id="tab3" aria-controls="panel3" >Entête n<sup>o</sup> 3</button>
  </h3>
  <div id="panel3" aria-labelledby="tab3">
    <p>---</p>
  </div>
  <h3>
    <button id="tab4" aria-controls="panel4">Entête n<sup>o</sup> 4</button>
  </h3>
  <div id="panel4" aria-labelledby="tab4">
    <p>---</p>
  </div>
</div>
```

A `disabled` attribute set to `true` on a `button` will disable the `button` and the associated `element` making them unfocusable and unselectable.

If you wish to open one specific tab when the script starts, just add the `data-expand` attribute with the value of `true` on the desired `button`:

To allow multiple panels to be opened at the same time add `data-multiselectable="true"` to the parent of the headers and panels

```html
<div class="accordion" data-multiselectable="true">
  <h3>
    <button id="tab1" aria-controls="panel1" data-expand="true">Entête n<sup>o</sup> 1</button>
  </h3>
  ---
</div>
```

### CSS

At least a <abbr title="Cascading Style Sheets">CSS</abbr> selector for panels to be hidden when not selected:

```css
.accordion [aria-hidden="true"] {
  display: none;
}
```

The selector can be anything you want, like a class, as the script allows callback when opening or closing a panel; you can add your own class using the callbacks.

### JavaScript

The script itself, either from npm:

```bash
$ npm install @accede-web/accordion
```

and later in your code:

```js
var Accordion = require( '@accede-web/accordion' );

// or

import Accordion from @accede-web/accordion;
```

or downloaded from Github and added to the page (minified and non minified versions available in the `dist` folder)

```html
<script src="./js/accordion.min.js"></script>
```

Using the later, the script will be available on `window` under the namespace `Accordion`.

Now to kick off the script:

```js
// get the tablist element
var list = document.querySelector( '.accordion' );

// create the tablist instance
var accordion = new window.Accordion( list );

// optionnaly add callbacks on show and hide a panel
accordion.on( 'show', function( header, panel ){
  …
});

accordion.on( 'hide', function( header, panel ){
  …
});

// start the plugin
accordion.mount();
```

## Parameters

The script takes one parameter:

* the `accordion` <abbr title="Document Object Model">DOM</abbr> element

As the script takes only one `accordion` element as parameter you have to loop over each `accordion` to kick off the script on each of them.

```js
var lists = document.querySelectorAll( '.accordion' );

Array.prototype.forEach.call( lists, function( list ) {
  new window.Accordion( list ).mount();
});
```

## Methods

The `Accordion` constructor returns 4 methods:

* `mount()` - start the magic
* `unmount()` - unbind keyboard and mouse events
* `on( event, callback )` - bind a callback to either the `show` or `hide` event triggered when changing panel. Both `header` and `panel` HTMLElement are passed on the callback
* `off( event, callback )` - unbind a callback to either the `show` or `hide` event triggered when changing panel
* `closeAll()` - Close all currently opened panels (will trigger a `hide` event on each opened panel).
* `close( panel )` - Close a panel. `panel` is an `HTMLElement` representing the panel. It will trigger a `hide` event on the panel.
* `openAll()` - Open all panels (will trigger a `show` event on each opened panel).
* `open( panel )` - Open a panel. `panel` is an `HTMLElement` representing the panel. It will trigger a `show` event on the panel.

## Properties

To know which `header` and `panel` is open use `accordion.current`. It will return an array containing all opened headers and panels

```js
// ES6 destructuring array
const [ accordion1, ... ] = accordion.current;
const { header, panel } = accordion1;

// ES5
var accordions = accordion.current;

accordions.forEach( function( accordion ){
  accordion.header; // return the header
  accordion.panel; // return the panel
});
```

This allows you to add or remove your own `class` for <abbr title="Cascading Style Sheets">CSS</abbr> purposes or animate the opening or closing of the panel.

## Keyboard Interaction

The keyboard interactions are based on [Atalan's AcceDe Web guidelines (in French)](http://www.accede-web.com/notices/interface-riche/accordeons/) and [the WAI-AIRA 1.0 Authoring Practices](https://www.w3.org/TR/wai-aria-practices/#accordion)

* `Enter or Space`:
  * When focus is on the accordion header for a collapsed panel, expands the associated panel. If the implementation allows only one panel to be expanded, and if another panel is expanded, collapses that panel.
  * When focus is on the accordion header for an expanded panel, collapses the panel if the implementation supports collapsing. Some implementations require one panel to be expanded at all times and allow only one panel to be expanded; so, they do not support a collapse function.
* `Down Arrow`: If focus is on an accordion header, moves focus to the next accordion header. If focus is on the last accordion header, either does nothing or moves focus to the first accordion header.
* `Up Arrow`: If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.
* `Home`: When focus is on an accordion header, moves focus to the first accordion header.
* `End`: When focus is on an accordion header, moves focus to the last accordion header.
* `Control + Page Down`: If focus is inside an accordion panel or on an accordion header, moves focus to the next accordion header. If focus is in the last accordion header or panel, either does nothing or moves focus to the first accordion header.
* `Control + Page Up`: If focus is inside an accordion panel, moves focus to the header for that panel. If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.


## Compatibilty

This plugin is tested against the following browsers:

* Internet Explorer 9 and higher
* Microsoft Edge
* Chrome
* Firefox
* Safari


## Testing

Install the project dependencies:

```bash
$ npm install
```

Run the automated test cases:

```bash
$ npm test
```
