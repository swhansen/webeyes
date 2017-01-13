var svg = document.getElementById( 'radial-menu' ),
    items = svg.querySelectorAll( '.item' ),
    trigger = svg.getElementById( 'trigger' ),
    label = trigger.querySelectorAll( '#label' )[0],
    radialOpen = false;

var layerRadialSvg = document.getElementById( 'layer-radial-menu' ),
    layerRadialItems = layerRadialSvg.querySelectorAll( '.layer-radial-item' ),
    layerRadialTrigger = layerRadialSvg.getElementById( 'layer-radial-trigger' ),
    layerRadialLabel = layerRadialTrigger.querySelectorAll( '#layer-radial-label' )[ 0 ],
    layerRadialOpen = false;

var arRadialSvg = document.getElementById( 'ar-radial-menu' ),
    arRadialItems = arRadialSvg.querySelectorAll( '.ar-radial-item' ),
    arRadialTrigger = arRadialSvg.getElementById( 'ar-radial-trigger' ),
    arRadialLabel = arRadialTrigger.querySelectorAll( '#ar-radial-label' )[ 0 ],
    arRadialOpen = false;

  TweenLite.set( layerRadialItems, { scale:0, visibility:'visible' } );
  layerRadialSvg.style.pointerEvents = 'none';
  layerRadialTrigger.addEventListener( 'click', layerToggleMenu, true );

  function layerToggleMenu( event ) {
     if ( !event ) var event = window.event;
        event.stopPropagation();
        layerRadialOpen = !layerRadialOpen;
    if ( layerRadialOpen ) {
        TweenMax.staggerTo( layerRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        layerRadialLabel.innerHTML = "|";
        layerRadialSvg.style.pointerEvents = "none";
      } else {
        TweenMax.staggerTo( layerRadialItems, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        layerRadialLabel.innerHTML = "L";
        layerRadialSvg.style.pointerEvents = "none";
      }
    }

    layerRadialSvg.onclick = function( e ) {
        e.stopPropagation();
        layerRadialOpen = false;
        TweenMax.staggerTo( layerRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            layerRadialLabel.innerHTML = '+';
        layerRadialSvg.style.pointerEvents = 'none';
    };

    TweenLite.set( arRadialItems, { scale:0, visibility:"visible" } );
    arRadialSvg.style.pointerEvents = "none";
    arRadialTrigger.addEventListener( 'click', arToggleMenu, true );

    function arToggleMenu( event ) {
     if ( !event ) var event = window.event;
        event.stopPropagation();
        arRadialOpen = !arRadialOpen;
    if ( arRadialOpen ) {
        TweenMax.staggerTo( arRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        arRadialLabel.innerHTML = "|";
        arRadialSvg.style.pointerEvents = "none";
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
      svg.style.pointerEvents = 'none';
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
        layerRadialOpen = false;
        arRadialOpen = false;

        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        label.innerHTML = '+';
        svg.style.pointerEvents = 'none';

        TweenMax.staggerTo( layerRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        layerRadialLabel.innerHTML = '+';
        layerRadialSvg.style.pointerEvents = 'none';

        TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
        arRadialLabel.innerHTML = '+';
        arRadialSvg.style.pointerEvents = 'none';
    };
