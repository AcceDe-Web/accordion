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

    this._accordion = {};

    this._callbacks = {};

    this._handleDisplay = this._handleDisplay.bind( this );
    this._handleFocus = this._handleFocus.bind( this );
    this._handleHeaders = this._handleHeaders.bind( this );
    this._handlePanelFocus = this._handlePanelFocus.bind( this );
    this._handlePanel = this._handlePanel.bind( this );
  }

  /**
   * Retrieve first activable header (that does not have `disabled` attribute)
   */
  _firstActiveHeader() {
    let activeHeaderIndex;

    this._accordion.headers.some(( header, index ) => {
      if( !header.disabled ){
        activeHeaderIndex = index;

        return true;
      }
    });

    return activeHeaderIndex;
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

    this._toggleDisplay( this._accordion.headers.indexOf( header ));
  }


  /**
   * Update the current header index before selecting the current panel
   * @param {DOMEvent} e - A `FocusEvent` object
   */
  _handleFocus( e ){
    const header = e.currentTarget;

    if( header.disabled ){
      return;
    }

    this._accordion.currentIndex = this._accordion.headers.indexOf( header );
  }


  /**
   * Handle keystroke on [role=panel]
   * @param {DOMEvent} e - A `KeyboardEvent` object
   */
  _handlePanel( e ){

    if ( this._accordion.currentIndex === undefined ) {
      this._handlePanelFocus( e );
    }

    switch( e.keyCode ){
      // ctrl + page up
      case 33:
        if( e.ctrlKey ){
          e.preventDefault();
          // focus the previous header
          this._switchPanel( this._accordion.currentIndex - 1 );
        }
        break;
      // ctrl + page down
      case 34:
        if( e.ctrlKey ){
          e.preventDefault();
          // focus the next header
          this._switchPanel( this._accordion.currentIndex + 1 );
        }
        break;

      // focus back to header
      // ctrl + up
      case 38:
        if( e.ctrlKey ){
          e.preventDefault();
          // focus linked header
          this._switchPanel( this._accordion.currentIndex );
        }
        break;
    }
  }


  /**
   * Ensure that the current header index is the one matching the panel
   * @param {DOMEvent} e - A `FocusEvent` or `KeyboardEvent` object
   */
  _handlePanelFocus( e ){

    if( e.target.doubleFocus ){
      e.preventDefault();
      delete e.target.doubleFocus;

      return;
    }

    const panel = e.currentTarget;

    this._accordion.currentIndex = this._accordion.panels.indexOf( panel );

    // prevent double focus event when the inputs are focused
    if([ 'radio', 'checkbox' ].indexOf( e.target.type ) >= 0 ){
      e.target.doubleFocus = true;
    }
  }


  /**
   * Handle keystroke on [role=tab]
   * @param {DOMEvent} e - A `KeyboardEvent` object
   */
  _handleHeaders( e ){

    if ( this._accordion.currentIndex === undefined ) {
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
        // focus the last header
        this._switchPanel( this._accordion.headers.length - 1 );
        break;

        // home
      case 36:
        e.preventDefault();
        // focus the first active header
        this._switchPanel( this._firstActiveHeader());
        break;

        // left
      case 37:
      // up
      case 38:
        e.preventDefault();
        // focus the previous header
        this._switchPanel( this._accordion.currentIndex - 1 );
        break;

        // right
      case 39:
      // down
      case 40:
        e.preventDefault();
        // focus the next header
        this._switchPanel( this._accordion.currentIndex + 1 );
        break;
    }
  }

  /**
   * Dummy function
   */
  _noop(){}

  /**
   * Move the focus to the header based on the index
   * @param {number} index - Index of the element to focus
   */
  _switchPanel( index ){

    // handle disabled header
    if( this._accordion.headers[ index ] && this._accordion.headers[ index ].disabled ){

      // cycling forward? Then go one item further
      const newIndex = index > this._accordion.currentIndex ? index + 1 : index - 1;

      this._switchPanel( newIndex );

      return;
    }

    const firstActiveHeader = this._firstActiveHeader();

    if( index < firstActiveHeader ){
      this._accordion.currentIndex = this._accordion.headersLength - 1;
    }
    else if( index >= this._accordion.headersLength ){
      this._accordion.currentIndex = firstActiveHeader;
    }
    else {
      this._accordion.currentIndex = index;
    }

    this._accordion.headers[ this._accordion.currentIndex ].focus();
  }


  /**
   * Toggle the `aria-expanded` attribute on the header based on the passed index
   * @param {integer} index - index of the panel
   * @param {boolean} show - whether or not display the panel
   */
  _toggleDisplay( index, show ){
    const header = this._accordion.headers[ index ];
    const panel = this._accordion.panels[ index ];
    const headerDisplayed = header.getAttribute( 'aria-expanded' ) === 'true';

    if( show === undefined ){
      show = header.getAttribute( 'aria-expanded' ) === 'false';
    }

    if(( show && headerDisplayed ) || ( !show && !headerDisplayed )){
      return;
    }

    // close the previous header if the accordion doesn't allow multiple panels open
    if( show && !this.multiselectable && this._accordion.openedIndexes[ 0 ] !== undefined ){
      this._toggleDisplay( this._accordion.openedIndexes[ 0 ], false );
    }

    header.setAttribute( 'aria-expanded', show );
    panel.setAttribute( 'aria-hidden', !show );

    if( show ){
      this._accordion.openedIndexes.push( index );

      this._trigger( 'show', [ header, panel ]);
    }
    else{
      // remove the panel from the list of opened ones
      this._accordion.openedIndexes.splice( this._accordion.openedIndexes.indexOf( index ), 1 );

      this._trigger( 'hide', [ header, panel ]);
    }
  }

  _trigger( eventName, params ){
    if( !this._callbacks[ eventName ]){
      return;
    }

    this._callbacks[ eventName ].forEach( callback => {
      callback.apply( this, params );
    });
  }

  closeAll(){
    this._accordion.panels.forEach(( panel, index ) => {
      this._toggleDisplay( index, false );
    });
  }

  close( panel ){
    const index = this._accordion.panels.indexOf( panel );

    this._toggleDisplay( index, false );
  }

  /**
   * Parse the accordion children to setup the headers and panels elements
   */
  mount(){
    // create reference arrays
    this._accordion.headers = [];
    this._accordion.panels = [];
    this._accordion.openedIndexes = [];

    // loop on each headers elements to find panel elements and update their attributes
    Array.from( this.el.children ).forEach(( header, index ) => {
      const isHeader = headersNodeNames.indexOf( header.nodeName ) > -1;

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
      this._accordion.headers.push( header );
      this._accordion.panels.push( panel );

      header.disabled = header.hasAttribute( 'disabled' ) || header.getAttribute( 'aria-disabled' ) === 'true';

      if( header.getAttribute( 'data-expand' ) === 'true' && !header.disabled ){
        if( this.multiselectable || ( !this.multiselectable && !this._accordion.openedIndexes.length )){
          this._toggleDisplay( index, true );

          openedTab = true;
        }
      }

      // remove setup data attributes
      header.removeAttribute( 'data-expand' );

      // set the attributes according the the openedTab status
      header.setAttribute( 'tabindex', 0 );
      header.setAttribute( 'aria-expanded', openedTab );
      panel.setAttribute( 'aria-hidden', !openedTab );

      // subscribe internal events for header and panel
      header.addEventListener( 'click', this._handleDisplay );
      header.addEventListener( 'focus', this._handleFocus );
      header.addEventListener( 'keydown', this._handleHeaders );
      panel.addEventListener( 'focus', this._handlePanelFocus, true );
      panel.addEventListener( 'keydown', this._handlePanel );
    });

    // store constants
    this._accordion.headersLength = this._accordion.headers.length;
    this._accordion.panelsLength = this._accordion.panels.length;
  }

  off( event, callback ){
    if( !this._callbacks[ event ]){
      return;
    }

    const callbackIndex = this._callbacks[ event ].indexOf( callback );

    if( callbackIndex < 0 ){
      return;
    }

    this._callbacks[ event ].splice( callbackIndex, 1 );
  }

  on( event, callback ){
    if( callbackEvents.indexOf( event ) < 0 ){
      return;
    }

    if( !this._callbacks[ event ]){
      this._callbacks[ event ] = [];
    }

    this._callbacks[ event ].push( callback );
  }

  /**
   * Returns an array of opened panels
   */
  get current(){
    return this._accordion.openedIndexes.map( index => {
      return {
        header: this._accordion.headers[ index ],
        panel: this._accordion.panels[ index ]
      };
    });
  }

  /**
   * unbind accordion
   */
  unmount(){
    this._accordion.headers.forEach(( header, index ) => {
      const panel = this._accordion.panels[ index ];

      // unsubscribe internal events for header and panel
      header.removeEventListener( 'click', this._handleDisplay );
      header.removeEventListener( 'focus', this._handleFocus );
      header.removeEventListener( 'keydown', this._handleHeaders );

      header.removeAttribute( 'tabindex' );
      header.removeAttribute( 'aria-expanded' );

      panel.removeEventListener( 'focus', this._handlePanelFocus, true );
      panel.removeEventListener( 'keydown', this._handlePanel );
      panel.setAttribute( 'aria-hidden', 'false' );
    });
  }
}

export default Accordion;
