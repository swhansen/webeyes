var arRadialSvg = document.getElementById('ar-radial-menu'),
    arRadialItems = arRadialSvg.querySelectorAll('.ar-radial-item'),
    arRadialTrigger = arRadialSvg.getElementById('ar-radial-trigger'),
    arRadialLabel = arRadialTrigger.querySelectorAll('#ar-radial-label')[0],
    arRadialOpen = false;

    //first scale the elements down
    TweenLite.set( arRadialItems, { scale:0, visibility:"visible" } );
    arRadialSvg.style.pointerEvents = "none";

    //set up event handler
    arRadialTrigger.addEventListener( 'click', arToggleMenu, false );

    //toggle menu when trigger is clicked

    function arToggleMenu( event ) {
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


//close the nav when document is clicked
document.onclick = function () {
    arRadialOpen = false;
    TweenMax.staggerTo( arRadialItems, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
    arRadialLabel.innerHTML = "+";
    arRadialSvg.style.pointerEvents = "none";
};