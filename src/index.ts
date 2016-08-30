import {Promise} from "es6-promise";
import {polyfill} from "es6-promise";

import {ISimpleSearchOptions} from "./interfaces";
// import utils from "./utils";


const NS = "SimpleSearch";

var suppressWarnings = false;

var instances:SimpleSearch[] = [];

class SimpleSearch {
    private opts:ISimpleSearchOptions;

    constructor(opts:ISimpleSearchOptions, completeCB:Function) {
        this.opts = opts;
    }

    private init():any { // returns a promise
        
        var opts:ISimpleSearchOptions = this.opts;

        
    }

}

export function init(opts:ISimpleSearchOptions):void {
    
}

export var testable = {
    suppressWarnings: function(val:boolean) {
        suppressWarnings = val;
    }
}
