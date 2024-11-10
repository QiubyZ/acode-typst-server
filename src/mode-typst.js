// define Typst syntax highlighting for Ace Editor (mode-typst.js)

ace.define("ace/mode/typst", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "./typst-fold-mode", "./typs_syntaxt_highligt"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var TypstHighlightRules = require("./typs_syntaxt_highligt").TypstHighlightRules;
    var TypstFoldMode = require("./typst-fold-mode").TypstFoldMode;

    var Mode = function() {
        this.HighlightRules = TypstHighlightRules; // Tidak perlu new di sini karena sudah di-instansiasi di dalam modul highlight rules
        this.foldingRules = new TypstFoldMode();  // Assign ke foldingRules
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);
    Mode.prototype.lineCommentStart = "#";

    (function() {
        this.$id = "ace/mode/typst";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});