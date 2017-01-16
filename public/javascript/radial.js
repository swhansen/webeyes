
var radialList = [
  'draw-radial-menu',
  'ar-radial-menu',
  'util-radial-menu'
];

var svg = document.getElementById( 'radial-menu' ),
    items = svg.querySelectorAll( '.item' ),
    trigger = svg.getElementById( 'trigger' ),
    label = trigger.querySelectorAll( '#label' )[0],
    radialOpen = false;

var drawRadialSvg = document.getElementById( 'draw-radial-menu' ),
    drawRadialItems = drawRadialSvg.querySelectorAll( '.draw-radial-item' ),
    drawRadialTrigger = drawRadialSvg.getElementById( 'draw-radial-trigger' ),
    drawRadialLabel = drawRadialTrigger.querySelectorAll( '#draw-radial-label' )[ 0 ],
    drawRadialOpen = false;

var arRadialSvg = document.getElementById( 'ar-radial-menu' ),
    arRadialItems = arRadialSvg.querySelectorAll( '.ar-radial-item' ),
    arRadialTrigger = arRadialSvg.getElementById( 'ar-radial-trigger' ),
    arRadialLabel = arRadialTrigger.querySelectorAll( '#ar-radial-label' )[ 0 ],
    arRadialOpen = false;

var utilRadialSvg = document.getElementById( 'util-radial-menu' ),
    utilRadialItems = utilRadialSvg.querySelectorAll( '.util-radial-item' ),
    utilRadialTrigger = utilRadialSvg.getElementById( 'util-radial-trigger' ),
    utilRadialLabel = utilRadialTrigger.querySelectorAll( '#util-radial-label' )[ 0 ],
    utilRadialOpen = false;

// drawRadialSvg.style.visibility = 'hidden';
// drawRadialTrigger.style.visibility = 'hidden';

function moveRadialtoTop( radialMenu ) {
 _.forEach( radialList, function( key ) {
     document.getElementById( key ).style.zIndex = '10';
     console.log( key );
    } );
  document.getElementById( radialMenu ).style.zIndex = '100';
}

function moveRadialtoBottom( radialMenu ) {
 _.forEach( radialList, function( key ) {
     document.getElementById( key ).style.zIndex = '100';
     console.log( key );
    } );
  document.getElementById( radialMenu ).style.zIndex = '10';
}

//$( '#draw-radial-item-2' ).attr( 'style', 'visibility: hidden');
//$( '#draw-radial-item-4' ).attr( 'style', 'visibility: hidden');
$( '#draw-radial-item-2' ).css( 'visibility', 'hidden');
$( '#draw-radial-item-4' ).css( 'visibility', 'hidden');

  TweenLite.set( drawRadialItems, { scale:0, visibility:'visible' } );
  drawRadialSvg.style.pointerEvents = 'none';
  drawRadialTrigger.addEventListener( 'click', drawToggleMenu, true );

  function drawToggleMenu( event ) {

        moveRadialtoTop( 'draw-radial-menu' );

        moveLayertoTop( 'canvaspane' );
        userContext.uiState = 'draw';
      setDomPointerEvent( 'arcanvaspane', 'none' );
      setDomPointerEvent( 'canvas0', 'auto' );
      setDomPointerEvent( 'arcanvaspane', 'none' );



  //      document.getElementById( 'canvaspane' ).style.zIndex = '200';
  //      document.getElementById( 'arcanvaspane' ).style.zIndex = '10';

     if ( !event ) var event = window.event;
        event.stopPropagation();
        drawRadialOpen = !drawRadialOpen;
    if ( drawRadialOpen ) {
        TweenMax.staggerTo( drawRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        drawRadialLabel.innerHTML = '';
        drawRadialSvg.style.pointerEvents = 'auto';
      } else {
        TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        drawRadialLabel.innerHTML = '';
        drawRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'draw-radial-menu' );
      }
    }

    drawRadialSvg.onclick = function( e ) {
        e.stopPropagation();
        drawRadialOpen = false;
        TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            drawRadialLabel.innerHTML = '';
        drawRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'draw-radial-menu' );
    };

    TweenLite.set( arRadialItems, { scale:0, visibility:'visible' } );
    arRadialSvg.style.pointerEvents = 'none';
    arRadialTrigger.addEventListener( 'click', arToggleMenu, true );

    function arToggleMenu( event ) {

        moveRadialtoTop( 'ar-radial-menu' );

        moveLayertoTop( 'arcanvaspane' );
      //  document.getElementById( 'canvaspane' ).style.zIndex = '10';
      //  document.getElementById( 'arcanvaspane' ).style.zIndex = '200';

     if ( !event ) var event = window.event;
        event.stopPropagation();
        arRadialOpen = !arRadialOpen;
    if ( arRadialOpen ) {
        TweenMax.staggerTo( arRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        arRadialLabel.innerHTML = '';
        arRadialSvg.style.pointerEvents = 'auto';
      } else {
        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        arRadialLabel.innerHTML = '';
        arRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'ar-radial-menu' );
      }
    }

    arRadialSvg.onclick = function( e ) {
        e.stopPropagation();
        arRadialOpen = false;
        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            arRadialLabel.innerHTML = '';
        arRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'ar-radial-menu' );
    };

    TweenLite.set( utilRadialItems, { scale:0, visibility:'visible' } );
    utilRadialSvg.style.pointerEvents = 'none';
    utilRadialTrigger.addEventListener( 'click', utilToggleMenu, true );

    function utilToggleMenu( event ) {

        moveRadialtoTop( 'util-radial-menu' );

     if ( !event ) var event = window.event;
        event.stopPropagation();
        utilRadialOpen = !utilRadialOpen;
    if ( utilRadialOpen ) {
        TweenMax.staggerTo( utilRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        utilRadialLabel.innerHTML = '';
        utilRadialSvg.style.pointerEvents = 'auto';
      } else {
        TweenMax.staggerTo( utilRadialItems, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        utilRadialLabel.innerHTML = '';
        utilRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'util-radial-menu' );
      }
    }

    utilRadialSvg.onclick = function( e ) {
        e.stopPropagation();
        utilRadialOpen = false;
        TweenMax.staggerTo( utilRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        utilRadialLabel.innerHTML = '';
        utilRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'util-radial-menu' );
    };

    TweenLite.set( items, { scale:0, visibility: 'visible' } );
    svg.style.pointerEvents = 'none';
    trigger.addEventListener( 'click', toggleMenu, true );

    function toggleMenu( event ) {
    if ( !event ) var event = window.event;
    event.stopPropagation();
    radialOpen = !radialOpen;
    if ( radialOpen ) {
        TweenMax.staggerTo( items, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        label.innerHTML = '';
      svg.style.pointerEvents = 'auto';
    } else {
        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        label.innerHTML = '';
      svg.style.pointerEvents = 'none';
    }
    }

    svg.onclick = function( e ) {
        e.stopPropagation();
        radialOpen = false;
        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            label.innerHTML = '';
        svg.style.pointerEvents = 'none';
    };

//close the nav when document is clicked

    document.onclick = function() {
        radialOpen = false;
        drawRadialOpen = false;
        arRadialOpen = false;
        utilRadialOpen = false;

        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        label.innerHTML = '';
        svg.style.pointerEvents = 'none';

        TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        drawRadialLabel.innerHTML = '';
        drawRadialSvg.style.pointerEvents = 'none';

        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        arRadialLabel.innerHTML = '';
        arRadialSvg.style.pointerEvents = 'none';

        TweenMax.staggerTo( utilRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        utilRadialLabel.innerHTML = '';
        utilRadialSvg.style.pointerEvents = 'none';
    };
