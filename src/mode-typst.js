// define Typst syntax highlighting for Ace Editor (mode-typst.js)

// ace.define("ace/mode/typst_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require, exports, module) {
//   "use strict";

//   var oop = require("../lib/oop");
//   var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

//   var TypstHighlightRules = function() {

//     var keywords = (
//       "show|set|import|let|if|else|for|in|while|break|continue|" +
//       "return|fn|content|geometry|page|heading|numbering|font|" +
//       "style|box|image|table|raw|" +
//       "place|align|pad|grid|stack|repeat|" +
//       "text|math|quote|list|enum|term|code|" +
//       "heading|numbering|font|style|box|" +
//       "image|table|raw"
//     );

//     var types = (
//       "int|float|string|bool|array|dict|auto" +
//       "|length|angle|ratio|integer|string|" +
//       "boolean|dictionary|array|function|" +
//       "content|none" // Add more as needed
//     );


//     var builtinConstants = (
//       "none|auto|true|false"
//     );

//     var builtinFunctions = (
//       "calc|eval|str|repr|type|range|len|abs|min|max|round|ceil|floor|" + // General functions
//       "sin|cos|tan|asin|acos|atan|sqrt|log|exp|" + // Math functions
//       "rgb|rgba|hsl|hsla|cmyk|" + // Color functions
//       "font|heading|numbering|counter"  // Typst-specific functions (add more)
//     );


//     var keywordMapper = this.createKeywordMapper({
//       "support.function": builtinFunctions,
//       "keyword": keywords,
//       "storage.type": types,
//       "constant.language": builtinConstants
//     }, "identifier", true);




//     this.$rules = {
//       "start": [{
//         token: "comment",
//         regex: "#.*$"
//       }, {
//         token: "string",           // multi line string start
//         regex: /"""/,
//         next: "qqstring"
//       }, {
//         token: "string",           // " string
//         regex: '"(?=.)',
//         next: "qstring"
//       }, {  // Regular Expressions -- these are almost the same as javascript
//         token: "string.regexp",
//         regex: "\\/",
//         next: "regex"
//       }, {
//         token: keywordMapper,
//         regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
//       }, {
//         token: "constant.numeric", // float
//         regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
//       }, {
//         token: "keyword.operator",
//         regex: "\\+|\\-|\\*|\\/|\\/\\/|%|&|\\^|~|<|>|<=|=>|==|!=|&&|\\|\\|"
//       }, {
//         token: "paren.lparen",
//         regex: "[\\(\\{\\[]"
//       }, {
//         token: "paren.rparen",
//         regex: "[\\)\\}\\]]"
//       }, {
//         token: "text",
//         regex: "\\s+"
//       }],

//       "qqstring": [{
//         token: "string", // multi line string end
//         regex: /"""/,
//         next: "start"
//       }, {
//         token: "constant.language.escape",
//         regex: /\\(?:u[\\\dA-Fa-f]{4}|x[\\\dA-Fa-f]{2}|[0-7]{1,3}|'|"|\\|\/|b|f|n|r|t)/
//       }, {
//         token: "string",
//         regex: "."
//       }],
//       "qstring": [{
//         token: "string",
//         regex: '"',
//         next: "start"
//       }, {
//         token: "constant.language.escape",
//         regex: /\\(?:u[\\\dA-Fa-f]{4}|x[\\\dA-Fa-f]{2}|[0-7]{1,3}|'|"|\\|\/|b|f|n|r|t)/
//       }, {
//         token: "string",
//         regex: "."
//       }],

//       "regex": [
//         {
//           token: "regexp.keyword.operator",
//           regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
//         },
//         {
//           token: "string.regexp",
//           regex: "/",
//           next: "start"
//         },
//         {
//           token: "string.regexp",
//           regex: "[^/\\\\[]*"

//         },
//         {
//           token: "string.regexp.escape",
//           regex: /\\./
//         }
//       ]
//     };

//     this.normalizeRules();
//   };
  
//   TypstHighlightRules.metaData = {
//     name: "Typst",
//     scopeName: "source.typst",
//     fileTypes: ["typ"],  // Atau ["typst"] jika Anda menggunakan ekstensi .typst
//     foldingStartMarker: /\\{/, // Contoh: Gunakan kurung kurawal untuk folding
//     foldingStopMarker: /\\}/   // Contoh: Gunakan kurung kurawal untuk folding
//   };

//   oop.inherits(TypstHighlightRules, TextHighlightRules);
//   exports.TypstHighlightRules = TypstHighlightRules;
// });

ace.define("ace/mode/typst", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/folding/fold_mode", "ace/mode/typst_highlight_rules"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextMode = require("ace/mode/text").Mode;
  var TypstHighlightRules = require("ace/mode/typst_highlight_rules").TypstHighlightRules;
  var FoldMode = require("./folding/fold_mode").FoldMode;


  function TypstFoldMode() {
  }
  oop.inherits(TypstFoldMode, FoldMode);

  (function() {

    this.getFoldWidget = function(session, foldStyle, row) {
      let line = session.getLine(row);

      // Mencari awal blok dengan pola "#namaFungsi(" atau keyword tertentu
      if (line.match(/#[a-zA-Z_]+\(/) || line.match(/^(#set|#let|#if|#for|#while)\b/)) {
        return "start";
      }

      return "";
    };

    this.getFoldWidgetRange = function(session, foldStyle, row) {
      let startRow = row;
      let endRow = row;
      let indentLevel = session.getIndentString(startRow).length;
      let openBrackets = 0;

      const checkStart = (line) => line.match(/#[a-zA-Z_]+\(/) || line.match(/^(#set|#let|#if|#for|#while)\b/)

      const countBrackets = (line) => {
        openBrackets += (line.match(/\(/g) || []).length;
        openBrackets -= (line.match(/\)/g) || []).length;
        openBrackets += (line.match(/\[/g) || []).length;
        openBrackets -= (line.match(/\]/g) || []).length;
        openBrackets += (line.match(/\{/g) || []).length;
        openBrackets -= (line.match(/\}/g) || []).length;
      }

      countBrackets(session.getLine(startRow));

      for (let i = startRow + 1; i < session.getLength(); ++i) {
        let line = session.getLine(i);
        let currentIndent = session.getIndentString(i).length;

        countBrackets(line)

        if (currentIndent <= indentLevel && openBrackets <= 0) {
          endRow = i;
          break;
        }
      }

      if (endRow === startRow) {
        endRow = session.getLength() - 1;
      }

      return {start: {row: startRow}, end: {row: endRow}};
    };

  }).call(TypstFoldMode.prototype);




  var Mode = function() {
    this.HighlightRules = TypstHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new TypstFoldMode(); // Assign folding rules
  };
  oop.inherits(Mode, TextMode);
  Mode.prototype.lineCommentStart = "#";


  (function() {
    this.$id = "ace/mode/typst";
  }).call(Mode.prototype);

  exports.Mode = Mode;
});

// ace.define("ace/mode/typst", ["require", "exports", "module", "ace/mode/folding/fold_mode", "ace/lib/oop", "ace/mode/text", "ace/mode/typst_highlight_rules"], function(require, exports, module) {
//   "use strict";

//   var oop = require("../lib/oop");
//   //./text
//   var TextMode = require("ace/mode/text").Mode;
//   var TypstHighlightRules = require("ace/mode/typst_highlight_rules").TypstHighlightRules;
//   //let FoldMode = ace.require("ace/mode/folding/cstyle").FoldMode;

//   var Mode = function() {

//     this.HighlightRules = TypstHighlightRules;
//     this.$behaviour = this.$defaultBehaviour; // if you need custom folding or other advanced features
//     //this.FoldMode = new FoldMode();
//   };
//   oop.inherits(Mode, TextMode);
//   Mode.prototype.lineCommentStart = "#";
//   // Mode.prototype.blockComment = {start: "/*", end: "*/"}; // if you have block comments

//   (function() {
//     this.$id = "ace/mode/typst";
//   }).call(Mode.prototype);

//   exports.Mode = Mode;
// });