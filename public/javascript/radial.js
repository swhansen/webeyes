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

  TweenLite.set( drawRadialSvg, { scale:0, visibility:'visible' } );
  drawRadialSvg.style.pointerEvents = 'none';
  drawRadialTrigger.addEventListener( 'click', drawToggleMenu, true );

  function layerToggleMenu( event ) {

    console.log( 'drawToggleMenu:', event );
     if ( !event ) var event = window.event;
        event.stopPropagation();
        drawRadialOpen = !drawRadialOpen;
    if ( drawRadialOpen ) {
        TweenMax.staggerTo( drawRadialSvg, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        drawRadialLabel.innerHTML = "|";
        drawRadialSvg.style.pointerEvents = "auto";
      } else {
        TweenMax.staggerTo( drawRadialSvg, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        drawRadialLabel.innerHTML = "D";
        drawRadialSvg.style.pointerEvents = "none";
      }
    }

    drawRadialSvg.onclick = function( e ) {
        e.stopPropagation();
        drawRadialOpen = false;
        TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            drawRadialLabel.innerHTML = '+';
        drawRadialSvg.style.pointerEvents = 'none';
    };






    TweenLite.set( arRadialItems, { scale:0, visibility:"visible" } );
    arRadialSvg.style.pointerEvents = "none";
    arRadialTrigger.addEventListener( 'click', arToggleMenu, true );

    function arToggleMenu( event ) {
      console.log( 'arToggleMenu:', event );
     if ( !event ) var event = window.event;
        event.stopPropagation();
        arRadialOpen = !arRadialOpen;
    if ( arRadialOpen ) {
        TweenMax.staggerTo( arRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        arRadialLabel.innerHTML = "|";
        arRadialSvg.style.pointerEvents = "auto";
      } else {
        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        arRadialLabel.innerHTML = "+";
        arRadialSvg.style.pointerEvents = "none";
      }
    }

    arRadialSvg.onclick = function( e ) {
        e.stopPropagation();
        arRadialOpen = false;
        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            arRadialLabel.innerHTML = '+';
        arRadialSvg.style.pointerEvents = 'none';
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
        label.innerHTML = '-';
      svg.style.pointerEvents = 'auto';
    } else {
        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        label.innerHTML = '+';
      svg.style.pointerEvents = 'none';
    }
    }

    svg.onclick = function( e ) {
        e.stopPropagation();
        radialOpen = false;
        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            label.innerHTML = '+';
        svg.style.pointerEvents = 'none';
    };

//close the nav when document is clicked

    document.onclick = function() {
        radialOpen = false;
        drawRadialOpen = false;
        arRadialOpen = false;

        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        label.innerHTML = '+';
        svg.style.pointerEvents = 'none';

        TweenMax.staggerTo( drawRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        drawRadialLabel.innerHTML = '+';
        drawRadialSvg.style.pointerEvents = 'none';

        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        arRadialLabel.innerHTML = '+';
        arRadialSvg.style.pointerEvents = 'none';
    };
