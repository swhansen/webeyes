
function initModme() {

$( function() {
  $( "#focus-participant" ).tooltip( {
      content: "Select a participant box to focus",
      track:true
    } );
  } );

modmeUI();
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
         else if ( !( _.includes( [ 'devme', 'modme' ], inputValue ) ) ) {
          console.log('bcode is', inputValue);
           swal.showInputError( 'Please enter a valid code' );
           return false;
      } else {
         usebcode( inputValue );
         swal.close();
      }
  } );
} );

function usebcode( bcode )
{
  console.log('at usebcode with:', bcode);
  switch ( bcode )
  {
   case 'modme':
   modmeState = true;
   $.getJSON( '../menudescriptors/modmeStructure.json', function( data ) {
      uiStructure = data;
    } );
    //$( '#codeDialogModal' ).dialog( 'close' );
    for ( button in uiStructure.structure ) {
      t = 1000;
      $( uiStructure.structure[button].mainButton ).fadeOut( t );
    }
    document.getElementById( 'devmeButton' ).style.visibility = "hidden";
    document.getElementById( 'modmeButton' ).style.visibility = "visible";
    var mainCollapsed = true;
    break;
   case 'devme':
    $.getJSON( '../menudescriptors/devmeStructure.json', function( data ) {
      uiStructure = data;
    } );
    //$( '#codeDialogModal' ).dialog( 'close' );
    for ( button in uiStructure.structure ) {
      t = 1000;
      $( uiStructure.structure[button].mainButton ).fadeOut( t );
    }
    document.getElementById( 'modmeButton' ).style.visibility = "hidden";
    document.getElementById( 'devmeButton' ).style.visibility = "visible";
    var mainCollapsed = true;
} };

//function focusVideo( boxNo ) {
//  var sessionId = socketServer.sessionid;
//  socketServer.emit( 'focus', boxNo, sessionId );
//}

socketServer.on( 'focus', function( boxNo ) {
  console.log('recieved boxno:', boxNo);
   focusUser( boxNo );
   //b = document.getElementById( boxNo );
   //b.click();
  }
 );