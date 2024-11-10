// typst-fold-mode.js
ace.define("ace/mode/folding/typst", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode"], function(require, exports, module) {
    "use strict";
    var oop = require("../../lib/oop");
    var FoldMode = require("./fold_mode").FoldMode;

    var TypstFoldMode = function() {};
    oop.inherits(TypstFoldMode, FoldMode);

    (function() {

        this.getFoldWidget = function(session, foldStyle, row) {
            let line = session.getLine(row);

            // Regex yang lebih efisien untuk mencari awal blok
            if (line.match(/#([a-zA-Z_]+\(|set|let|if|else|for|while)\b/)) {
                return "start";
            }

            return "";
        };

        this.getFoldWidgetRange = function(session, foldStyle, row) {
            let startRow = row;
            let endRow = row;
            let indentLevel = session.getIndentString(startRow).length;
            let openBrackets = 0;

            const countBrackets = (line) => {
                let matches;
                // Menggunakan while loop untuk menghindari error "Maximum call stack size exceeded"
                while ((matches = /(\(|\)|\[|\]|\{|\})/g.exec(line)) !== null) { //regex global flag
                    switch(matches[1]){
                        case '(': case '[': case '{': openBrackets++; break;
                        case ')': case ']': case '}': openBrackets--; break;
                    }
                }

            };

            countBrackets(session.getLine(startRow));

            for (let i = startRow + 1; i < session.getLength(); ++i) {
                let line = session.getLine(i);
                let currentIndent = session.getIndentString(i).length;

                countBrackets(line);

                if (currentIndent <= indentLevel && openBrackets <= 0) {
                    endRow = i;
                    break;
                }
            }

            // Penanganan single-line blocks yang disederhanakan
            if (endRow === startRow && session.getLine(startRow + 1) && session.getIndentString(startRow + 1).length < indentLevel) {
                endRow++;
            }
           
            

            return {start: {row: startRow}, end: {row: endRow}};
        };

    }).call(TypstFoldMode.prototype);

    exports.TypstFoldMode = TypstFoldMode;
});