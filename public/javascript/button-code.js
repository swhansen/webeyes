
//
//   Functions for execution of the "button-code"
// Button codes are user to invoke functions that are restricted
//  - invoked through the + main menu button
//  - pulls in a specific menudescriptor JSON file
//

function initModme() {

$( function() {
  $( "#focus-participant" ).tooltip( {
      content: "Select a participant box to focus",
      track:true
    } );
  } );

modmeUI();
setDomMouseEvent('canvas0', 'none');
};

// UI code input dialog

$( '#codeDialogModal' ).dialog( {
        autoOpen: false
    } );
 $( '#codeDialogButton' ).click( function() {
  swal({
    title: "Button Code",
    text: "Input your Super Secret Button Code",
    type: "input",
    showCancelButton: true,
    closeOnCancel: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Button Code"
      },
        function(inputValue){
          if (inputValue === false) return false;
            if (inputValue === "") {
            swal.showInputError("Please Enter Code!");
            return false;
            }
         else if ( !( _.includes( [ 'devme', 'modme', 'augme' ], inputValue ) ) ) {
          //console.log('bcode is', inputValue);
           swal.showInputError( 'Please enter a valid code' );
           return false;
      } else {
         usebcode( inputValue );
         swal.close();
      }
  } );
} );

//  button code logic
//   - check for legal codes
//   - pull in the json menu descriptor for the code
//   - do the menu stuff

function usebcode( bcode )
{
  switch ( bcode )
  {
   case 'modme':
  // modmeState = true;
   userContext.modMeState = true;
   $.getJSON( '../menudescriptors/modmeStructure.json', function( data ) {
      uiStructure = data;
    } );
    for ( button in uiStructure.structure ) {
      t = 1000;
      $( uiStructure.structure[button].mainButton ).fadeOut( t );
    }
    document.getElementById( 'devmeButton' ).style.visibility = "hidden";
    document.getElementById( 'modmeButton' ).style.visibility = "visible";
    var mainCollapsed = true;
    break;

    case 'augme':
   $.getJSON( '../menudescriptors/augMeStructure.json', function( data ) {
      uiStructure = data;
    } );
    for ( button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }
    document.getElementById( 'devmeButton' ).style.visibility = "hidden";
    document.getElementById( 'modmeButton' ).style.visibility = "hidden";
    document.getElementById( 'augmeButton' ).style.visibility = "visible";
    var mainCollapsed = true;
    break;
   case 'devme':
    $.getJSON( '../menudescriptors/devmeStructure.json', function( data ) {
      uiStructure = data;
    } );
    for ( button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }
    document.getElementById( 'modmeButton' ).style.visibility = "hidden";
    document.getElementById( 'devmeButton' ).style.visibility = "visible";
    var mainCollapsed = true;
} };

// recieving unique rtcID

socketServer.on( 'focus', function( id ) {
  //console.log('at button-code - socketServer Recieved rtcID:', id);
   focusUser( id );
  }
 );