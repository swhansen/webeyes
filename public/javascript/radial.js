
var radialList = [
  'draw-radial-menu',
  'ar-radial-menu',
  'util-radial-menu'
];

var radialTriggerCircle = [
  'util-radial-circle',
  'draw-radial-circle',
  'ar-radial-circle'
];

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

function moveRadialtoTop( radialMenu ) {
 _.forEach( radialList, function( key ) {
     document.getElementById( key ).style.zIndex = '10';
    } );
  document.getElementById( radialMenu ).style.zIndex = '100';
}

//document.getElementById("radialMenu").style.fill = '#fff';

function moveRadialtoBottom( radialMenu ) {
 _.forEach( radialList, function( key ) {
     document.getElementById( key ).style.zIndex = '100';
    } );
  document.getElementById( radialMenu ).style.zIndex = '10';
}

function highlightSelectedRadial( radialTrigger ) {
 _.forEach( radialTriggerCircle, function(  key ) {
     document.getElementById( key ).style.fill = '#448AFF';
    } );
  document.getElementById( radialTrigger ).style.fill = '#E91E63';
}

function clearObjects() {
  removeUserCreatedArObjects();
  clearUtilCanvas();
  clearDrawCanvas();
  emitUtility( 'reset' );
      }

// draw radial

$( '#draw-radial-item-1' ).css( 'visibility', 'hidden' );
$( '#draw-radial-item-4' ).css( 'visibility', 'hidden' );
$( '#draw-radial-item-5' ).css( 'visibility', 'hidden' );

  TweenLite.set( drawRadialItems, { scale:0, visibility:'visible' } );
  drawRadialSvg.style.pointerEvents = 'none';
  drawRadialTrigger.addEventListener( 'click', drawToggleMenu, true );

  function drawToggleMenu( event ) {

    highlightSelectedRadial( 'draw-radial-circle' );
    moveRadialtoTop( 'draw-radial-menu' );

    $( '#draw-radial-item-1' ).css( 'visibility', 'hidden' );
    $( '#draw-radial-item-4' ).css( 'visibility', 'hidden' );

      moveLayertoTop( 'canvaspane' );
      userContext.uiState = 'draw';
      setDomPointerEvent( 'arcanvaspane', 'none' );
      setDomPointerEvent( 'canvas0', 'auto' );
      setDomPointerEvent( 'arcanvaspane', 'none' );

     if ( !event ) var event = window.event;
        event.stopPropagation();
        drawRadialOpen = !drawRadialOpen;
    if ( drawRadialOpen ) {
        TweenMax.staggerTo( drawRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        drawRadialLabel.innerHTML = '';
        drawRadialSvg.style.pointerEvents = 'auto';
      } else {
        TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        drawRadialLabel.innerHTML = '';
        drawRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'draw-radial-menu' );
      }
    }

drawRadialSvg.onclick = function( e ) {

  if ( e.target.parentNode.id === 'draw-radial-erase' ) {
    var selectedSectorId = '#' + e.target.parentNode.id;
    if ( fadeSwitch ) {
        $( selectedSectorId ).children( 'path' ).css( { fill: '#ff0000' } );
      } else {
        $( selectedSectorId ).children( 'path' ).css( { fill: '#008000' } );
      }
    }
  e.stopPropagation();
  drawRadialOpen = false;
  TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
  drawRadialLabel.innerHTML = '';
  drawRadialSvg.style.pointerEvents = 'none';
  moveRadialtoBottom( 'draw-radial-menu' );
};

  // ar radial

    TweenLite.set( arRadialItems, { scale:0, visibility:'visible' } );
    arRadialSvg.style.pointerEvents = 'none';
    arRadialTrigger.addEventListener( 'click', arToggleMenu, true );

    function arToggleMenu( event ) {

        highlightSelectedRadial( 'ar-radial-circle' );
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
        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        arRadialLabel.innerHTML = '';
        arRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'ar-radial-menu' );
      }
    }

    arRadialSvg.onclick = function( e ) {

      if ( userContext.participantState === 'peer' ) {
        $( '#ar-radial-compass' ).css( 'visibility', 'hidden' );
        }

      if ( e.target.parentNode.id === 'ar-radial-compass' ) {
        let selectedSectorId = '#' + e.target.parentNode.id;
        if ( compassToggle ) {
          $( selectedSectorId ).children( 'path' ).css( { fill: '#ff0000' } );
        } else {
          $( selectedSectorId ).children( 'path' ).css( { fill: '#008000' } );
        }
      }
        e.stopPropagation();
        arRadialOpen = false;
        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            arRadialLabel.innerHTML = '';
        arRadialSvg.style.pointerEvents = 'none';
        moveRadialtoBottom( 'ar-radial-menu' );
    };

  // utility radial

    TweenLite.set( utilRadialItems, { scale:0, visibility:'visible' } );
    utilRadialSvg.style.pointerEvents = 'none';
    utilRadialTrigger.addEventListener( 'click', utilToggleMenu, true );

    function utilToggleMenu( event ) {

        highlightSelectedRadial( 'util-radial-circle' );
        moveRadialtoTop( 'util-radial-menu' );
         moveLayertoTop( 'doccanvaspane' );

     if ( !event ) var event = window.event;
        event.stopPropagation();
        utilRadialOpen = !utilRadialOpen;
    if ( utilRadialOpen ) {
        TweenMax.staggerTo( utilRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        utilRadialLabel.innerHTML = '';
        utilRadialSvg.style.pointerEvents = 'auto';
      } else {
        TweenMax.staggerTo( utilRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
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

//    TweenLite.set( items, { scale:0, visibility: 'visible' } );
//    svg.style.pointerEvents = 'none';
//    trigger.addEventListener( 'click', toggleMenu, true );
//
//    function toggleMenu( event ) {
//    if ( !event ) var event = window.event;
//    event.stopPropagation();
//    radialOpen = !radialOpen;
//    if ( radialOpen ) {
//        TweenMax.staggerTo( items, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
//        label.innerHTML = '';
//      svg.style.pointerEvents = 'auto';
//    } else {
//        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
//        label.innerHTML = '';
//      svg.style.pointerEvents = 'none';
//    }
//    }
//
//    svg.onclick = function( e ) {
//        e.stopPropagation();
//        radialOpen = false;
//        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
//            label.innerHTML = '';
//        svg.style.pointerEvents = 'none';
//    };

//close the nav when document is clicked

    document.onclick = function() {

  //      radialOpen = false;
  //      drawRadialOpen = false;
  //      arRadialOpen = false;
  //      utilRadialOpen = false;
//
  //      TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
  //      label.innerHTML = '';
  //      svg.style.pointerEvents = 'none';

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
