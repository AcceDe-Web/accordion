/* eslint-env node */
'use strict';

const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = `file://${__dirname}/accordion.html`;

const createBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto( path );

  return [ browser, page ];
};

test( 'Mount', async t => {

  const [ browser, page ] = await createBrowser();

  const [ buttonTabindex, buttonExpanded, panelHidden ] = await page.evaluate(() => {
    const headers = Array.from( document.querySelectorAll( '[aria-controls]' ));
    const panels = Array.from( document.querySelectorAll( '[aria-labelledby]' ));

    const buttonTabindex = headers.every( header => {
      return header.tabIndex === 0;
    });

    const buttonExpanded = headers.every( header => {
      return header.getAttribute( 'aria-expanded' ) === 'false';
    });

    const panelHidden = panels.every( panel => {
      return panel.getAttribute( 'aria-hidden' ) === 'true';
    });

    return [
      buttonTabindex,
      buttonExpanded,
      panelHidden
    ];
  });

  t.true( buttonTabindex, 'Tous les headers ont « [tabindex="0"] »' );
  t.true( buttonExpanded, 'Tous les headers ont « [aria-expanded="false"] »' );
  t.true( panelHidden, 'Tous les panels ont « [aria-hidden="true"] »' );

  await browser.close();

  t.end();
});

test( 'Mouse', async t => {

  const [ browser, page ] = await createBrowser();

  await page.click( '[aria-controls]' );

  let [ expanded, hidden ] = await page.evaluate(() => {
    const header = document.querySelector( '[aria-controls]' );
    const panel = document.querySelector( '[aria-labelledby]' );

    return [
      header.getAttribute( 'aria-expanded' ) === 'true',
      panel.getAttribute( 'aria-hidden' ) === 'true'
    ];
  });

  t.true( expanded, 'Le header cliqué à « [aria-expanded="true"] »' );
  t.false( hidden, 'Le panneau associé à « [aria-hidden="false"] »' );

  await browser.close();

  t.end();
});

test( 'Keyboard', async t => {

  const [ browser, page ] = await createBrowser();

  await page.focus( '[aria-controls]' );
  await page.keyboard.press( 'Enter' );

  const [ expanded, hidden ] = await page.evaluate(() => {
    const header = document.querySelector( '[aria-controls]' );
    const panel = document.querySelector( '[aria-labelledby]' );

    return [
      header.getAttribute( 'aria-expanded' ) === 'true',
      panel.getAttribute( 'aria-hidden' ) === 'true'
    ];
  });

  t.true( expanded, 'Le header activé par « Enter » à « [aria-expanded="true"] »' );
  t.false( hidden, 'Le panneau associé à « [aria-hidden="false"] »' );

  await page.keyboard.press( 'ArrowDown' );
  await page.keyboard.press( 'Enter' );

  const [ nextExpanded, nextHidden, previousExpanded, previousHidden ] = await page.evaluate(() => {
    const header = document.querySelector( '.tab:nth-of-type(2) [aria-controls]' );
    const panel = document.querySelector( '[aria-labelledby]:nth-of-type(2)' );

    const previousHeader = document.querySelector( '[aria-controls]' );
    const previousPanel = document.querySelector( '[aria-labelledby]' );

    return [
      header.getAttribute( 'aria-expanded' ) === 'true',
      panel.getAttribute( 'aria-hidden' ) === 'true',
      previousHeader.getAttribute( 'aria-expanded' ) === 'true',
      previousPanel.getAttribute( 'aria-hidden' ) === 'true'
    ];
  });

  t.true( nextExpanded, 'Le second header activé par « Enter » à « [aria-expanded="true"] »' );
  t.false( nextHidden, 'Le panneau associé à « [aria-hidden="false"] »' );

  t.true( previousExpanded, 'Le précédent header activé par « Enter » à « [aria-expanded="true"] » (multiselectable)' );
  t.false( previousHidden, 'Le panneau associé à « [aria-hidden="false"] » (multiselectable)' );

  await page.keyboard.press( 'Enter' );
  await page.keyboard.press( 'Tab' );
  await page.keyboard.press( 'Tab' );

  const tabToLast = await page.evaluate(() => {
    return document.activeElement.id === 'tab4';
  });

  t.true( tabToLast, 'La tabulation permet d’accéder au dernier header' );

  await page.keyboard.press( 'ArrowDown' );

  const arrowToFirst = await page.evaluate(() => {
    return document.activeElement.id === 'tab1';
  });

  t.true( arrowToFirst, 'La touche « Flèche bas » focus le premier header' );

  await page.keyboard.press( 'ArrowUp' );

  const arrowToLast = await page.evaluate(() => {
    return document.activeElement.id === 'tab4';
  });

  t.true( arrowToLast, 'La touche « Flèche haut » focus le dernier header' );

  // test non multiselectable accordion
  await page.focus( '#tab11' );
  await page.keyboard.press( 'Enter' );

  const notMultiFirstExpanded = await page.evaluate(() => {
    const header = document.querySelector( '.accordion2 .tab [aria-controls]' );
    const panel = document.querySelector( '.accordion2 [aria-labelledby]' );

    return header.getAttribute( 'aria-expanded' ) === 'true' && panel.getAttribute( 'aria-hidden' ) === 'false';
  });

  await page.keyboard.press( 'ArrowRight' );
  await page.keyboard.press( 'Enter' );

  const [ nextNotMultiExpanded, nextNotMultiHidden, previousNotMultiExpanded, previousNotMultiHidden ] = await page.evaluate(() => {
    const header = document.querySelector( '.accordion2 .tab:nth-of-type(2) [aria-controls]' );
    const panel = document.querySelector( '.accordion2 [aria-labelledby]:nth-of-type(2)' );

    const previousHeader = document.querySelector( '.accordion2 [aria-controls]' );
    const previousPanel = document.querySelector( '.accordion2 [aria-labelledby]' );

    return [
      header.getAttribute( 'aria-expanded' ) === 'true',
      panel.getAttribute( 'aria-hidden' ) === 'false',
      previousHeader.getAttribute( 'aria-expanded' ) === 'false',
      previousPanel.getAttribute( 'aria-hidden' ) === 'true'
    ];
  });

  t.true( notMultiFirstExpanded && nextNotMultiExpanded, 'Le second header activé par « Enter » à « [aria-expanded="true"] » (non multiselectable)' );
  t.true( notMultiFirstExpanded && nextNotMultiHidden, 'Le panneau associé à « [aria-hidden="false"] »(non multiselectable)' );

  t.true( notMultiFirstExpanded && previousNotMultiExpanded, 'Le précédent header activé par « Enter » à « [aria-expanded="false"] » (non multiselectable)' );
  t.true( notMultiFirstExpanded && previousNotMultiHidden, 'Le panneau associé à « [aria-hidden="true"] » (non multiselectable)' );

  await browser.close();

  t.end();
});

test( 'Panel navigation', async t => {

  const [ browser, page ] = await createBrowser();

  await page.focus( '.tab:nth-of-type(2) [aria-controls]' );
  await page.keyboard.press( 'Space' );
  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'ArrowUp' );
  await page.keyboard.up( 'Control' );

  const crtlUp = await page.evaluate(() => {
    return document.querySelector( '.tab:nth-of-type(2) [aria-controls]' ) === document.activeElement;
  });

  // move to second panel
  await page.keyboard.press( 'ArrowDown' );

  // tab back to a link in the first panel
  await page.keyboard.down( 'Shift' );
  await page.keyboard.press( 'Tab' );
  await page.keyboard.up( 'Shift' );

  // focus the first header
  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'ArrowUp' );
  await page.keyboard.up( 'Control' );

  const panelHeaderFocus = await page.evaluate(() => {
    return document.querySelector( '.tab:nth-of-type(2) [aria-controls]' ) === document.activeElement;
  });

  t.true( crtlUp && panelHeaderFocus, 'La combinaison « Ctrl + Flèche haut » focus le header lié au panneau' );

  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const pageUp = await page.evaluate(() => {
    return document.querySelector( '[aria-controls]' ) === document.activeElement;
  });

  t.true( pageUp, 'La combinaison « Ctrl + Page précédente » focus le header précédent' );

  await page.keyboard.press( 'Enter' );
  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const pageDown = await page.evaluate(() => {
    return document.querySelector( '.tab:nth-of-type(2) [aria-controls]' ) === document.activeElement;
  });

  t.true( pageDown, 'La combinaison « Ctrl + Page suivante » focus le header suivant' );

  await page.focus( '[aria-controls]' );
  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const pageUpFirst = await page.evaluate(() => {
    return document.activeElement.id === 'tab4';
  });

  t.true( pageUpFirst, 'La combinaison « Ctrl + Page précédente » focus le dernier header depuis le premier panneau' );

  await page.keyboard.press( 'Space' );
  await page.focus( '#panel4 a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const pageDownFirst = await page.evaluate(() => {
    return document.activeElement.id === 'tab1';
  });

  t.true( pageDownFirst, 'La combinaison « Ctrl + Page suivante » focus le premier header depuis le dernier panneau' );

  await browser.close();

  t.end();
});

test( 'Callbacks', async t => {

  const [ browser, page ] = await createBrowser();

  await page.click( '[aria-controls]' );

  const [ openHeader, openPanel ] = await page.evaluate(() => {
    const header = document.querySelector( '[aria-controls]' );
    const panel = document.querySelector( '.panel' );

    return [
      window.openCallback.header === header,
      window.openCallback.panel === panel
    ];
  });

  await page.click( '[aria-controls]' );

  const [ closeHeader, closePanel ] = await page.evaluate(() => {
    const header = document.querySelector( '[aria-controls]' );
    const panel = document.querySelector( '.panel' );


    return [
      window.closeCallback.header === header,
      window.closeCallback.panel === panel
    ];
  });

  t.true( openHeader && openPanel, 'Le header cliqué déclanche le callback « show »' );
  t.true( closeHeader && closePanel, 'Le header recliqué déclanche le callback « hide »' );

  await browser.close();

  t.end();
});


test( 'Open All', async t => {

  const [ browser, page ] = await createBrowser();

  const [ openHeaders, openPanels ] = await page.evaluate(() => {
    window.accordeons[ 0 ].openAll();


    const header = document.querySelectorAll( '[aria-controls][aria-expanded="true"]' );
    const panel = document.querySelectorAll( '.panel[aria-hidden="false"]' );


    return [
      header.length,
      panel.length
    ];
  });

  t.true( openHeaders === 4 && openPanels === 4, 'La méthode « openAll » ouvre tous les panneaux' );

  await browser.close();

  t.end();
});


test( 'Close All', async t => {

  const [ browser, page ] = await createBrowser();

  const [ closedHeaders, closedPanels ] = await page.evaluate(() => {
    window.accordeons[ 0 ].openAll();

    window.accordeons[ 0 ].closeAll();

    const header = document.querySelectorAll( '[data-multiselectable="true"] [aria-controls][aria-expanded="false"]' );
    const panel = document.querySelectorAll( '[data-multiselectable="true"] .panel[aria-hidden="true"]' );


    return [
      header.length,
      panel.length
    ];
  });

  t.true( closedHeaders === 4 && closedPanels === 4, 'La méthode « openAll » ouvre tous les panneaux' );

  await browser.close();

  t.end();
});
