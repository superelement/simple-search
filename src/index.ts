// import {Promise} from "es6-promise";
// import {polyfill} from "es6-promise";

import {ISimpleSearchBarOptions} from "./interfaces";

const NS = "SimpleSearchBar";
const PRF = ".smpSch-";
const IS_FOC = "is-focussed";

var simpleSearchBar = {};
var isBrowser:boolean = typeof window !== "undefined";

if(isBrowser) {
    let win:any = window;
    simpleSearchBar = win[NS] = {};
}

var suppressWarnings = false;

var instances:SimpleSearchBar[] = [];

class SimpleSearchBar {
    public opts:ISimpleSearchBarOptions;
    public externalClear:boolean;

    constructor(opts:ISimpleSearchBarOptions) {
        this.opts = opts;
        this.externalClear = false;
    }

}


function init(opts:ISimpleSearchBarOptions):void {

    // TODO: add check for drift state

    var inst:SimpleSearchBar = new SimpleSearchBar(opts);
    instances.push( inst );


    var $el:HTMLElement = opts.el
        , $inp:HTMLInputElement = getInp($el)
        , $btnCls:HTMLButtonElement = <HTMLButtonElement>$el.querySelector(PRF + "btnclose")
        , $btnSubmit:HTMLButtonElement = <HTMLButtonElement>$el.querySelector(PRF + "btnsubmit")
        , justCleared:boolean = false
        , ignoreBlur:boolean = false

    console.log(opts.el, $el.querySelector(PRF+"form"))

    var close = function ():void {
        if (opts.clearOnFocusOut) $inp.value = "";

        setTimeout(function () {
            if (!justCleared) {
                $el.classList.remove(IS_FOC); // TODO: add drift state
            }
        }, 100);

        setTimeout(function () {
            if (!$el.classList.contains(IS_FOC)) {
                if (opts.closeCB) opts.closeCB($inp.value);
            }
        }, 110);
    }

    // stops focus from anywhere in this widget from triggering close

    $el.addEventListener("mousedown", function (evt) {
        ignoreBlur = true;
        setTimeout(function () {
            ignoreBlur = false;
        }, 10);
    });


    $inp.addEventListener("focus", function () {
        $el.classList.add(IS_FOC); //TODO: add drift state
    });

    $inp.addEventListener("blur", function () {
        if (!ignoreBlur && !inst.externalClear) close();
    });


    $btnCls.addEventListener("click", function (evt:KeyboardEvent) {

        ///console.log("real close");

        justCleared = true;

        if ($inp.value === "") {
            // if already empty trigger the close
            focusOut($el, opts.closeCB, opts.clearCB);
        } else {
            $inp.value = "";
            $inp.focus();
            if (opts.clearCB) opts.clearCB();
        }

        setTimeout(function () {
            justCleared = false;
        }, 101);
    });

    var keyUpFun = (evt:KeyboardEvent) => {
        // escape pressed on keyboard
        if (evt.keyCode === 27 && $inp.value !== "") $inp.value = "";
    }

    var keyDownFun = (evt:KeyboardEvent) => {
        // escape pressed on keyboard
        if (evt.keyCode === 27 && $inp.value === "") focusOut($el, opts.closeCB, opts.clearCB);
    }

    $el.removeEventListener("keyup", keyUpFun);
    $el.addEventListener("keyup", keyUpFun);

    // Firefox won't work unless this is on keydown and other browsers are ok with it, so using it for all
    $el.removeEventListener("keydown", keyDownFun);
    $el.addEventListener("keydown", keyDownFun);


    // Add event listener to input element for submit instead of form submission.
    $inp.addEventListener("keydown", function (evt) {
        if (evt.keyCode === 13) {
            evt.preventDefault();
            if (opts.submitCB && $inp.value !== "") {
                evt.preventDefault();
                opts.submitCB($inp.value);
                $el.classList.remove(IS_FOC); //TODO: add drift state
                // console.log($inp.value);
            }
        }
    });

    // Add secondary event listener to submit button if it exists for submit instead of form submission.

    if (opts.submitCB && $btnSubmit) {
        $btnSubmit.addEventListener("click", function(evt) {
            evt.preventDefault();
            opts.submitCB($inp.value);
            $el.classList.remove(IS_FOC); //TODO: add drift state
        });
    }

    refreshUI($el);
}


// gets an instance by passing the root HTMLElement
function getInst($el:HTMLElement):SimpleSearchBar {
    var inst:SimpleSearchBar;
    instances.some((_inst) => {
        inst = _inst;
        return _inst.opts.el === $el; // breaks loop
    });

    return inst;
}


function getInp($el:HTMLElement):HTMLInputElement {
    return <HTMLInputElement>$el.querySelector(PRF + "input");
}


// removes focus
function focusOut($el:HTMLElement, closeCB?:Function, clearCB?:Function) {
    var $inp:HTMLInputElement = getInp($el)
    $inp.blur();
    $el.classList.remove(IS_FOC); // TODO: add drift state
    if (closeCB) closeCB($inp.value);
    if (clearCB) clearCB();
}


// gives focus
function giveFocus($el:HTMLElement) {
    var $inp:HTMLInputElement = getInp($el)
    $inp.focus();
}


// clears the input field
function clear($el:HTMLElement) {
    var $inp:HTMLInputElement = getInp($el)
    $inp.value = "";
}


// gets the value of the input field
function getInputText($el:HTMLElement) {
    var $inp:HTMLInputElement = getInp($el)
    return $inp.value;
}

// clears and removes focus
function close($el:HTMLElement) {
    var inst:SimpleSearchBar = getInst($el);
    var prp:ISimpleSearchBarOptions = inst.opts;

    inst.externalClear = true;

    if (prp.clearOnFocusOut) {
        var $inp:HTMLInputElement = getInp($el)
        $inp.value = "";
    }

    focusOut($el);

    setTimeout(function () {
        inst.externalClear = false;
    }, 1000);
}

// used for placeholder polyfill
function refreshUI($el:HTMLElement) {
    // call this if ui was hidden on load, but is now visible
    //$el.find(PRF + "input").placeholder();
}

simpleSearchBar = {
    init: init
    , clear: clear
    , close: close
    , giveFocus: giveFocus
    , getInputText: getInputText
    , refreshUI: refreshUI
    , testable: {
        suppressWarnings: function(val:boolean) {
            suppressWarnings = val;
        }
    }
}

// make available in Common.js
if(!isBrowser) module.exports = simpleSearchBar; 
