/* eslint-env node */
'use strict';

const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = `file://${__dirname}/accordion.html`;

let browser;
let page;

// Label test suite in output
test( '-------------------------------', async t => {
  t.comment( 'Running *Tab* test suite.' );
  t.comment( '-------------------------------' );

  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto( path );

  t.end();
});

// test 5
test( '5| Un « Click » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', async t => {
  await page.reload();
  await page.click( '#tab2' );
  const result = await page.evaluate(() => {
    var tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '[aria-labelledby="' + tab.id + '"]' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'true', 'L’élément doit être actif.' );
  t.equal( result.ariaHidden, 'false', 'L’élément doit être affiché.' );
  t.end();
});


// test 6
test( '6| Une pression sur la touche « Entrée » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', async t => {
  await page.reload();
  await page.focus( '#tab2' );

  await page.keyboard.press( 'Enter' );

  const result = await page.evaluate(() => {
    var tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '[aria-labelledby="' + tab.id + '"]' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'true', 'L’élément doit être actif.' );
  t.equal( result.ariaHidden, 'false', 'L’élément doit être affiché.' );
  t.end();
});


// test 7
test( '7| Une pression sur la touche « Espace » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', async t => {
  await page.reload();
  await page.focus( '#tab2' );

  await page.keyboard.press( 'Space' );

  const result = await page.evaluate(() => {
    var tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '[aria-labelledby="' + tab.id + '"]' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'true', 'L’élément doit être actif.' );
  t.equal( result.ariaHidden, 'false', 'L’élément doit être affiché.' );
  t.end();
});


// test 8
test( '8| Un « Click » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', async t => {
  await page.reload();
  await page.click( '#tab2' );
  await page.click( '#tab2[aria-expanded="true"]' );
  const result = await page.evaluate(() => {
    var tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '[aria-labelledby="' + tab.id + '"]' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'false', 'L’élément doit être inactif.' );
  t.equal( result.ariaHidden, 'true', 'L’élément doit être masqué.' );
  t.end();
});


// test 9
test( '9| Une pression sur la touche « Entrée » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', async t => {
  await page.reload();
  await page.click( '#tab2' );
  await page.focus( '#tab2[aria-expanded="true"]' );

  await page.keyboard.press( 'Enter' );

  const result = await page.evaluate(() => {
    var tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '[aria-labelledby="' + tab.id + '"]' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'false', 'L’élément doit être inactif.' );
  t.equal( result.ariaHidden, 'true', 'L’élément doit être masqué.' );
  t.end();
});


// test 10
test( '10| Une pression sur la touche « Espace » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', async t => {
  await page.reload();
  await page.click( '#tab2' );
  await page.focus( '#tab2[aria-expanded="true"]' );

  await page.keyboard.press( 'Space' );

  const result = await page.evaluate(() => {
    var tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '[aria-labelledby="' + tab.id + '"]' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'false', 'L’élément doit être inactif.' );
  t.equal( result.ariaHidden, 'true', 'L’élément doit être masqué.' );
  t.end();
});


// test 11
test( '11| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', async t => {
  await page.reload();
  await page.focus( '#tab1' );

  await page.keyboard.press( 'ArrowUp' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3:last-of-type button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier élément.' );
  t.end();
});


// test 12
test( '12| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', async t => {
  await page.reload();
  await page.focus( '#tab2' );

  await page.keyboard.press( 'ArrowUp' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3 button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 13
test( '13| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', async t => {
  await page.reload();
  await page.focus( '#tab1' );

  await page.keyboard.press( 'ArrowLeft' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3:last-of-type button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier élément.' );
  t.end();
});


// test 14
test( '14| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', async t => {
  await page.reload();
  await page.focus( '#tab2' );

  await page.keyboard.press( 'ArrowLeft' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3 button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 15
test( '15| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur le dernier entête de panneau déplace le focus sur le premier entête de panneau.', async t => {
  await page.reload();
  await page.focus( 'h3:last-of-type button' );

  await page.keyboard.press( 'ArrowDown' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3 button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 16
test( '16| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau suivant.', async t => {
  await page.reload();
  await page.focus( 'h3 button' );

  await page.keyboard.press( 'ArrowDown' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le second élément.' );
  t.end();
});



// test 17
test( '17| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur le dernier entête de panneau déplace le focus sur le premier entête de panneau.', async t => {
  await page.reload();
  await page.focus( 'h3:last-of-type button' );

  await page.keyboard.press( 'ArrowRight' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3 button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 18
test( '18| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau suivant.', async t => {
  await page.reload();
  await page.focus( 'h3 button' );

  await page.keyboard.press( 'ArrowRight' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le second élément.' );
  t.end();
});


// test 19
test( '19| Une pression sur la combinaison de touches « Ctrl+Flèche haut » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de ce panneau.', async t => {
  await page.reload();
  await page.click( 'h3 button' );
  await page.focus( '.panel a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'ArrowUp' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3 button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier entête de panneau.' );
  t.end();
});


// test 20
test( '20| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément du premier panneau déplace le focus sur le dernier entête de panneau.', async t => {
  await page.reload();
  await page.click( 'h3 button' );
  await page.focus( '.panel a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3:last-of-type button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier entête de panneau.' );
  t.end();
});


// test 21
test( '21| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau précédent.', async t => {
  await page.reload();
  await page.click( '#tab2' );
  await page.focus( '[aria-labelledby="tab2"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab1' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier entête de panneau.' );
  t.end();
});


// test 22
test( '22| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément du dernier panneau déplace le focus sur le premier entête de panneau.', async t => {
  await page.reload();
  await page.click( 'h3:last-of-type button' );
  await page.focus( '.panel:last-of-type a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab1' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier entête de panneau.' );
  t.end();
});


// test 23
test( '23| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau suivant.', async t => {
  await page.reload();
  await page.click( 'h3 button' );
  await page.focus( '.panel a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le second entête de panneau.' );
  t.end();
});


// test 24
test( '24| Une pression sur la touche « Origine », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le premier entête de panneau.', async t => {
  await page.reload();
  await page.focus( '#tab3' );

  await page.keyboard.press( 'Home' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab1' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier entête de panneau.' );
  t.end();
});


// test 25
test( '25| Une pression sur la touche « Fin », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le dernier entête de panneau.', async t => {
  await page.reload();
  await page.focus( '#tab2' );

  await page.keyboard.press( 'End' );

  const result = await page.evaluate(() => {
    return document.querySelector( 'h3:last-of-type button' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier entête de panneau.' );
  t.end();
});


// test 26
test( '26| A l’ouverture d’un panneau, la fonction de callback correspondante doit être appelée.', async t => {
  await page.reload();
  await page.click( '#tab2' );
  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ).dataset.openCB;
  });

  t.equal( result, 'true', 'La fonction de callback doit être exécutée.' );
  t.end();
});


// test 27
test( '27| A la fermeture d’un panneau, la fonction de callback correspondante doit être appelée.', async t => {
  await page.reload();
  await page.click( '#tab2' );
  await page.click( '#tab2' );
  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ).dataset.closeCB;
  });

  t.equal( result, 'true', 'La fonction de callback doit être exécutée.' );
  t.end();
});


// test 28
test( '28| A la fermeture de tous les panneaux, la fonction de callback correspondante doit être appelée.', async t => {
  await page.reload();
  await page.click( '#tab1' );
  await page.click( '#tab2' );
  await page.click( '#tab3' );
  const result = await page.evaluate(() => {

    // close all tabs
    window.accordion.closeAll();

    return document.querySelector( '#tab1' ).dataset.closeCB === 'true' &&
             document.querySelector( '#tab2' ).dataset.closeCB === 'true' &&
             document.querySelector( '#tab3' ).dataset.closeCB === 'true' &&
             !document.querySelector( '#tab4' ).dataset.closeCB;
  });

  t.equal( result, true, 'La fonction de callback doit être exécutée.' );
  t.end();
});


// test 29
test( '29| Un « Click » sur une seconde entête de panneau garde le précédent panneau ouvert', async t => {
  await page.reload();
  await page.click( '#tab1' );
  await page.click( '#tab2' );
  const result = await page.evaluate(() => {
    var tab1 = document.getElementById( 'tab1' ),
      tab2 = document.getElementById( 'tab2' );

    return {
      aria1Expanded: tab1.getAttribute( 'aria-expanded' ),
      aria1Hidden: document.querySelector( '[aria-labelledby="' + tab1.id + '"]' ).getAttribute( 'aria-hidden' ),
      aria1CB: tab1.dataset.closeCB,
      aria2Expanded: tab2.getAttribute( 'aria-expanded' ),
      aria2Hidden: document.querySelector( '[aria-labelledby="' + tab2.id + '"]' ).getAttribute( 'aria-hidden' ),
      aria2CB: tab2.dataset.closeCB
    };
  });

  t.equal( result.aria1Expanded, 'true', 'L’élément précédent doit être actif.' );
  t.equal( result.aria1Hidden, 'false', 'L’élément précédent doit être affiché.' );
  t.equal( result.aria1CB, undefined, 'La fonction de calback de fermeture ne doit pas être exécuté sur l’élément précédent.' );
  t.equal( result.aria2Expanded, 'true', 'L’élément cliqué doit être actif.' );
  t.equal( result.aria2Hidden, 'false', 'L’élément cliqué doit être affiché.' );
  t.equal( result.aria2CB, undefined, 'La fonction de calback de fermeture ne doit pas être exécuté sur L’élément cliqué.' );
  t.end();
});

test.onFinish(() => browser.close());
