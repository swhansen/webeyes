
function vrRadial( menu ) {
var svg = document.getElementById( 'radial-menu' ),
    items = svg.querySelectorAll( '.item' ),
    trigger = svg.getElementById( 'trigger' ),
    label = trigger.querySelectorAll( '#label' )[0],
    radialOpen = false;

    //first scale the elements down
    TweenLite.set( items, { scale:0, visibility: 'visible' } );
    svg.style.pointerEvents = 'none';

    trigger.addEventListener( 'click', toggleMenu, false );
}
    //toggle menu when trigger is clicked

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
        TweenMax.staggerTo( items, 0.3, { scale:0, ease:Back.easeIn }, 0.05 );
            label.innerHTML = '+';
        svg.style.pointerEvents = 'none';
    };