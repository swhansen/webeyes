var layerRadialSvg = document.getElementById( 'layer-radial-menu' ),
    layerRadialItems = layerRadialSvg.querySelectorAll( '.layer-radial-item' ),
    layerRadialTrigger = layerRadialSvg.getElementById( 'layer-radial-trigger' ),
    layerRadialLabel = layerRadialTrigger.querySelectorAll( '#layer-radial-label' )[ 0 ],
    layerRadialOpen = false;

    //first scale the elements down
    TweenLite.set( layerRadialItems, { scale:0, visibility:'visible' } );
    layerRadialSvg.style.pointerEvents = 'none';

    //set up event handler
    layerRadialTrigger.addEventListener( 'click', layerToggleMenu, true );

    //toggle menu when trigger is clicked

    function layerToggleMenu( event ) {
     if ( !event ) var event = window.event;
        event.stopPropagation();
        layerRadialOpen = !layerRadialOpen;
    if ( layerRadialOpen ) {
        TweenMax.staggerTo( layerRadialItems, 0.7, { scale:1, ease:Elastic.easeOut }, 0.05 );
        layerRadialLabel.innerHTML = "|";
        layerRadialSvg.style.pointerEvents = "auto";
      } else {
        TweenMax.staggerTo( layerRadialItems, 0.3, { scale:0, ease:Back.easeIn}, 0.05 );
        layerRadialLabel.innerHTML = "L";
        layerRadialSvg.style.pointerEvents = "none";
      }
    }

layerRadialSvg.onclick = function( e ) {
    e.stopPropagation();
};

//close the nav when document is clicked
document.onclick = function () {
    layerRadialOpen = false;
    TweenMax.staggerTo( layerRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
    layerRadialLabel.innerHTML = "L";
    layerRadialSvg.style.pointerEvents = "none";
};