// import {Promise} from "es6-promise";
// import {polyfill} from "es6-promise";
"use strict";
var NS = "SimpleSearchBar";
var PRF = ".smpSch-";
var IS_FOC = "is-focussed";
var simpleSearchBar = {};
var isBrowser = typeof window !== "undefined";
if (isBrowser) {
    var win = window;
    simpleSearchBar = win[NS] = {};
}
var suppressWarnings = false;
var instances = [];
var SimpleSearchBar = (function () {
    function SimpleSearchBar(opts) {
        this.opts = opts;
        this.externalClear = false;
    }
    return SimpleSearchBar;
}());
function init(opts) {
    // TODO: add check for drift state
    var inst = new SimpleSearchBar(opts);
    instances.push(inst);
    var $el = opts.el, $inp = getInp($el), $btnCls = $el.querySelector(PRF + "btnclose"), $btnSubmit = $el.querySelector(PRF + "btnsubmit"), justCleared = false, ignoreBlur = false;
    console.log(opts.el, $el.querySelector(PRF + "form"));
    var close = function () {
        if (opts.clearOnFocusOut)
            $inp.value = "";
        setTimeout(function () {
            if (!justCleared) {
                $el.classList.remove(IS_FOC); // TODO: add drift state
            }
        }, 100);
        setTimeout(function () {
            if (!$el.classList.contains(IS_FOC)) {
                if (opts.closeCB)
                    opts.closeCB($inp.value);
            }
        }, 110);
    };
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
        if (!ignoreBlur && !inst.externalClear)
            close();
    });
    $btnCls.addEventListener("click", function (evt) {
        ///console.log("real close");
        justCleared = true;
        if ($inp.value === "") {
            // if already empty trigger the close
            focusOut($el, opts.closeCB, opts.clearCB);
        }
        else {
            $inp.value = "";
            $inp.focus();
            if (opts.clearCB)
                opts.clearCB();
        }
        setTimeout(function () {
            justCleared = false;
        }, 101);
    });
    var keyUpFun = function (evt) {
        // escape pressed on keyboard
        if (evt.keyCode === 27 && $inp.value !== "")
            $inp.value = "";
    };
    var keyDownFun = function (evt) {
        // escape pressed on keyboard
        if (evt.keyCode === 27 && $inp.value === "")
            focusOut($el, opts.closeCB, opts.clearCB);
    };
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
            }
        }
    });
    // Add secondary event listener to submit button if it exists for submit instead of form submission.
    if (opts.submitCB && $btnSubmit) {
        $btnSubmit.addEventListener("click", function (evt) {
            evt.preventDefault();
            opts.submitCB($inp.value);
            $el.classList.remove(IS_FOC); //TODO: add drift state
        });
    }
    refreshUI($el);
}
// gets an instance by passing the root HTMLElement
function getInst($el) {
    var inst;
    instances.some(function (_inst) {
        inst = _inst;
        return _inst.opts.el === $el; // breaks loop
    });
    return inst;
}
function getInp($el) {
    return $el.querySelector(PRF + "input");
}
// removes focus
function focusOut($el, closeCB, clearCB) {
    var $inp = getInp($el);
    $inp.blur();
    $el.classList.remove(IS_FOC); // TODO: add drift state
    if (closeCB)
        closeCB($inp.value);
    if (clearCB)
        clearCB();
}
// gives focus
function giveFocus($el) {
    var $inp = getInp($el);
    $inp.focus();
}
// clears the input field
function clear($el) {
    var $inp = getInp($el);
    $inp.value = "";
}
// gets the value of the input field
function getInputText($el) {
    var $inp = getInp($el);
    return $inp.value;
}
// clears and removes focus
function close($el) {
    var inst = getInst($el);
    var prp = inst.opts;
    inst.externalClear = true;
    if (prp.clearOnFocusOut) {
        var $inp = getInp($el);
        $inp.value = "";
    }
    focusOut($el);
    setTimeout(function () {
        inst.externalClear = false;
    }, 1000);
}
// used for placeholder polyfill
function refreshUI($el) {
    // call this if ui was hidden on load, but is now visible
    //$el.find(PRF + "input").placeholder();
}
simpleSearchBar = {
    init: init,
    clear: clear,
    close: close,
    giveFocus: giveFocus,
    getInputText: getInputText,
    refreshUI: refreshUI,
    testable: {
        suppressWarnings: function (val) {
            suppressWarnings = val;
        }
    }
};
// make available in Common.js
if (!isBrowser)
    module.exports = simpleSearchBar;
