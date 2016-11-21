// this is intended to run in a browser with 'index.js' loaded before it

var clearCB = function() {
	console.log("clearCB");
}
var closeCB = function() {
	console.log("closeCB");
}
var submitCB = function() {
	console.log("submitCB");
}

window.simpleSearchBar.init({
	el: document.querySelector(".smpSch")
    , clearCB:clearCB
    , closeCB:closeCB
    , submitCB:submitCB
    , clearOnFocusOut:true
})