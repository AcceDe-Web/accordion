/*eslint no-fallthrough: "off"*/
const callbackEvents = [ 'hide', 'show' ];
const headersNodeNames = [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ];

/**
 * Accordion constructor
 * @constructor
 * @param {Node} el - DOM node
 */
class Accordion{
  constructor( el ){
    if ( !el || !el.nodeName ) {
      throw new Error( 'No DOM node provided. Abort.' );
    }

    this.el = el;

    this.multiselectable = this.el.getAttribute( 'data-multiselectable' ) === 'true';

    this.accordion = {};

    this.callbacks = {};

    this._handleDisplay = this._handleDisplay.bind( this );
    this._handleFocus = this._handleFocus.bind( this );
    this._handleTab = this._handleTab.bind( this );
    this._handlePanelFocus = this._handlePanelFocus.bind( this );
    this._handlePanel = this._handlePanel.bind( this );
  }

  /**
   * Retrieve first activable tab (that does not have `disabled` attribute)
   */
  _firstActiveTab() {
    let activeTab;

    for( let i = 0; i < this.accordion.headers.length; i++ ) {
      if( !this.accordion.headers[ i ].disabled ){
        activeTab = i;
        break;
      }
    }

    return activeTab;
  }

  /**
   * Toggle display of the panel (show/hide)
   * @param {DOMEvent} e - Can be a `MouseEvent` or a `KeyboardEvent` object
   */
  _handleDisplay( e ){
    e.preventDefault();

    const header = e.currentTarget;

    if( header.disabled ){
      return;
    }

    // ensure the header has the focus when a click occurs
    if( header !== document.activeElement ){
      header.focus();
    }

    this._toggleDisplay( this.accordion.headers.indexOf( header ));
  }


  /**
   * Update the current header index before selecting the current tab
   * @param {DOMEvent} e - A `FocusEvent` object
   */
  _handleFocus( e ){
    const header = e.currentTarget;

    if( header.disabled ){
      return;
    }

    this.accordion.currentIndex = this.accordion.headers.indexOf( header );
  }


  /**
   * Handle keystroke on [role=panel]
   * @param {DOMEvent} e - A `KeyboardEvent` object
   */
  _handlePanel( e ){

    if ( this.accordion.currentIndex === undefined ) {
      this._handlePanelFocus( e );
    }

    switch( e.keyCode ){
      // ctrl + page up
      case 33:
        if( e.ctrlKey ){
          e.preventDefault();
          // focus the previous tab
          this._switchTab( this.accordion.currentIndex - 1 );
        }
        break;
      // ctrl + page down
      case 34:
        if( e.ctrlKey ){
          e.preventDefault();
          // focus the next tab
          this._switchTab( this.accordion.currentIndex + 1 );
        }
        break;

      // focus back to tab
      // ctrl + up
      case 38:
        if( e.ctrlKey ){
          e.preventDefault();
          // focus linked tab
          this._switchTab( this.accordion.currentIndex );
        }
        break;
    }
  }


  /**
   * Ensure that the current tab index is the one matching the panel
   * @param {DOMEvent} e - A `FocusEvent` or `KeyboardEvent` object
   */
  _handlePanelFocus( e ){

    if( e.target.doubleFocus ){
      e.preventDefault();
      delete e.target.doubleFocus;

      return;
    }

    const panel = e.currentTarget;

    this.accordion.currentIndex = this.accordion.panels.indexOf( panel );

    // prevent double focus event when the inputs are focused
    if([ 'radio', 'checkbox' ].indexOf( e.target.type ) >= 0 ){
      e.target.doubleFocus = true;
    }
  }


  /**
   * Handle keystroke on [role=tab]
   * @param {DOMEvent} e - A `KeyboardEvent` object
   */
  _handleTab( e ){

    if ( this.accordion.currentIndex === undefined ) {
      this._handleFocus( e );
    }

    switch( e.keyCode ){
      // space
      case 32:
      // return
      case 13:
        // toggle the display of the linked panel
        this._handleDisplay( e );
        break;

        // end
      case 35:
        e.preventDefault();
        // focus the last tab
        this._switchTab( this.accordion.headers.length - 1 );
        break;

        // home
      case 36:
        e.preventDefault();
        // focus the first active tab
        this._switchTab( this._firstActiveTab());
        break;

        // left
      case 37:
      // up
      case 38:
        e.preventDefault();
        // focus the previous tab
        this._switchTab( this.accordion.currentIndex - 1 );
        break;

        // right
      case 39:
      // down
      case 40:
        e.preventDefault();
        // focus the next tab
        this._switchTab( this.accordion.currentIndex + 1 );
        break;
    }
  }

  /**
   * Dummy function
   */
  _noop(){}

  /**
   * Update tab selected attributes (`aria-selected`, `tabindex`)
   * based on the `headerToSelect` attribute
   * @param {DOMElement} headerToSelect - Tab element to select
   */
  /* _select( headerToSelect ){
    // loop on each tab
    this.accordion.headers.forEach(( header, index ) => {
      const shouldSelect = headerToSelect === header;

      // header.setAttribute( 'aria-selected', shouldSelect );
      header.setAttribute( 'tabindex', shouldSelect ? 0 : -1 );

      // only for tab to be selected
      if ( shouldSelect ) {
        this._toggleDisplay( index );
      }
    });
  } */

  /**
   * Move the focus to the tab based on the index
   * @param {number} index - Index of the element to focus
   */
  _switchTab( index ){

    // handle disabled tab
    if( this.accordion.headers[ index ] && this.accordion.headers[ index ].disabled ){

      // cycling forward? Then go one item farther
      const newIndex = index > this.accordion.currentIndex ? index + 1 : index - 1;

      this._switchTab( newIndex );

      return;
    }

    this.accordion.currentIndex = index;

    if( this.accordion.currentIndex < this._firstActiveTab()){
      this.accordion.currentIndex = this.accordion.headersLength - 1;
    }
    else if( this.accordion.currentIndex >= this.accordion.headersLength ){
      this.accordion.currentIndex = this._firstActiveTab();
    }

    this.accordion.headers[ this.accordion.currentIndex ].focus();
  }


  /**
   * Toggle the `aria-expanded` attribute on the panel based on the passed tab
   * @param {DOMElement} tab - Tab element
   */
  _toggleDisplay( index, show ){
    const header = this.accordion.headers[ index ];
    const panel = this.accordion.panels[ index ];
    const headerDisplayed = header.getAttribute( 'aria-expanded' ) === 'true';

    if( show === undefined ){
      show = header.getAttribute( 'aria-expanded' ) === 'false';
    }

    if(( show && headerDisplayed ) || ( !show && !headerDisplayed )){
      return;
    }

    // close the previous header if the accordion doesn't allow multiple panels open
    if( show && !this.multiselectable && this.accordion.openedIndexes[ 0 ] !== undefined ){
      this._toggleDisplay( this.accordion.openedIndexes[ 0 ], false );
    }

    header.setAttribute( 'aria-expanded', show );
    panel.setAttribute( 'aria-hidden', !show );

    if( show ){
      this.accordion.openedIndexes.push( index );

      this._trigger( 'show', [ header, panel ]);
    }
    else{
      // remove the panel from the list of opened ones
      this.accordion.openedIndexes.splice( this.accordion.openedIndexes.indexOf( index ), 1 );

      this._trigger( 'hide', [ header, panel ]);
    }
  }

  _trigger( eventName, params ){
    if( !this.callbacks[ eventName ]){
      return;
    }

    this.callbacks[ eventName ].forEach( callback => {
      callback.apply( this, params );
    });
  }

  closeAll(){
    this.accordion.headers.forEach(( header, index ) => {
      this._toggleDisplay( index, false );
    });
  }

  /**
   * Parse tablist element to setup the tab and panel elements
   */
  mount(){
    // create reference arrays
    this.accordion.headers = [];
    this.accordion.panels = [];
    this.accordion.openedIndexes = [];

    // loop on each tab elements to find panel elements and update their attributes
    Array.from( this.el.children ).forEach(( header, index ) => {
      const isHeader = headersNodeNames.indexOf( header.nodeName ) > -1;

      // console.log( !isHeader && header.getAttribute( 'role' ) !== 'heading' );

      // skip non header child
      if( !isHeader && header.getAttribute( 'role' ) !== 'heading' && !header.hasAttribute( 'aria-level' )){
        return;
      }

      // set the header to be the button actioning the panel
      header = header.querySelector( 'button[aria-controls], [role="button"][aria-controls]' );

      if( !header ){
        return;
      }

      const panel = document.getElementById( header.getAttribute( 'aria-controls' ));
      let openedTab = false;

      if( !panel ){
        throw new Error( `Could not find associated panel for header ${header.id}. Use [aria-controls="panelId"] on the [role="header"] element to link them together` );
      }

      // store the header and the panel on their respective arrays on the headerlist
      this.accordion.headers.push( header );
      this.accordion.panels.push( panel );

      header.disabled = header.hasAttribute( 'disabled' ) || header.getAttribute( 'aria-disabled' ) === 'true';

      if( header.getAttribute( 'data-expanded' ) === 'true' && !header.disabled ){
        if( this.multiselectable || ( !this.multiselectable && !this.accordion.openedIndexes.length )){
          this._toggleDisplay( index, true );

          openedTab = true;
        }
      }

      // remove setup data attributes
      header.removeAttribute( 'data-expanded' );

      // set the attributes according the the openedTab status
      header.setAttribute( 'tabindex', 0 );
      header.setAttribute( 'aria-expanded', openedTab );
      panel.setAttribute( 'aria-hidden', !openedTab );

      // subscribe internal events for header and panel
      header.addEventListener( 'click', this._handleDisplay );
      header.addEventListener( 'focus', this._handleFocus );
      header.addEventListener( 'keydown', this._handleTab );
      panel.addEventListener( 'focus', this._handlePanelFocus );
      panel.addEventListener( 'keydown', this._handlePanel );
    });

    // store constants
    this.accordion.headersLength = this.accordion.headers.length;
    this.accordion.panelsLength = this.accordion.panels.length;
  }

  off( event, callback ){
    if( !this.callbacks[ event ]){
      return;
    }

    const callbackIndex = this.callbacks[ event ].indexOf( callback );

    if( callbackIndex < 0 ){
      return;
    }

    this.callbacks[ event ].splice( callbackIndex, 1 );
  }

  on( event, callback ){
    if( callbackEvents.indexOf( event ) < 0 ){
      return;
    }

    if( !this.callbacks[ event ]){
      this.callbacks[ event ] = [];
    }

    this.callbacks[ event ].push( callback );
  }

  /**
   * Returns the opened tab or array of opened tabs
   */
  get openedTab(){
    const header = this.accordion.headers[ this.accordion.openedIndexes ];
    const panel = this.accordion.panels[ this.accordion.openedIndexes ];

    return [
      header,
      panel
    ];
  }

  /**
   * unbind tablist
   */
  unmount(){
    this.accordion.headers.forEach(( header, index ) => {
      const panel = this.accordion.panels[ index ];

      // unsubscribe internal events for header and panel
      header.removeEventListener( 'click', this._handleDisplay );
      header.removeEventListener( 'focus', this._handleFocus );
      header.removeEventListener( 'keydown', this._handleTab );

      header.removeAttribute( 'tabindex' );
      header.removeAttribute( 'aria-expanded' );

      panel.removeEventListener( 'focus', this._handlePanelFocus );
      panel.removeEventListener( 'keydown', this._handlePanel );
      panel.setAttribute( 'aria-hidden', 'false' );
    });


    this.tablist = {};
  }
}

export default Accordion;
