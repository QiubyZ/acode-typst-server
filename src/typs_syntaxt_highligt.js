ace.define("ace/mode/typst_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

  var TypstHighlightRules = function() {

    var keywords = (
      "show|set|import|let|if|else|for|in|while|break|continue|" +
      "return|fn|content|geometry|page|heading|numbering|font|" +
      "style|box|image|table|raw|" +
      "place|align|pad|grid|stack|repeat|" +
      "text|math|quote|list|enum|term|code|" +
      "heading|numbering|font|style|box|" +
      "image|table|raw"
    );

    var types = (
      "int|float|string|bool|array|dict|auto" +
      "|length|angle|ratio|integer|string|" +
      "boolean|dictionary|array|function|" +
      "content|none" // Add more as needed
    );


    var builtinConstants = (
      "none|auto|true|false"
    );

    var builtinFunctions = (
      "calc|eval|str|repr|type|range|len|abs|min|max|round|ceil|floor|" + // General functions
      "sin|cos|tan|asin|acos|atan|sqrt|log|exp|" + // Math functions
      "rgb|rgba|hsl|hsla|cmyk|" + // Color functions
      "font|heading|numbering|counter"  // Typst-specific functions (add more)
    );


    var keywordMapper = this.createKeywordMapper({
      "support.function": builtinFunctions,
      "keyword": keywords,
      "storage.type": types,
      "constant.language": builtinConstants
    }, "identifier", true);




    this.$rules = {
      "start": [
                {
                    token: "string.math",
                    regex: /\$(?:(?!\$).)*\$/ // Regex untuk math mode
                },
      {
        token: "comment",
        regex: "#.*$"
      }, {
        token: "string",           // multi line string start
        regex: /"""/,
        next: "qqstring"
      }, {
        token: "string",           // " string
        regex: '"(?=.)',
        next: "qstring"
      }, {  // Regular Expressions -- these are almost the same as javascript
        token: "string.regexp",
        regex: "\\/",
        next: "regex"
      }, {
        token: keywordMapper,
        regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
      }, {
        token: "constant.numeric", // float
        regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
      }, {
        token: "keyword.operator",
        regex: "\\+|\\-|\\*|\\/|\\/\\/|%|&|\\^|~|<|>|<=|=>|==|!=|&&|\\|\\|"
      }, {
        token: "paren.lparen",
        regex: "[\\(\\{\\[]"
      }, {
        token: "paren.rparen",
        regex: "[\\)\\}\\]]"
      }, {
        token: "text",
        regex: "\\s+"
      }],

      "qqstring": [{
        token: "string", // multi line string end
        regex: /"""/,
        next: "start"
      }, {
        token: "constant.language.escape",
        regex: /\\(?:u[\\\dA-Fa-f]{4}|x[\\\dA-Fa-f]{2}|[0-7]{1,3}|'|"|\\|\/|b|f|n|r|t)/
      }, {
        token: "string",
        regex: "."
      }],
      "qstring": [{
        token: "string",
        regex: '"',
        next: "start"
      }, {
        token: "constant.language.escape",
        regex: /\\(?:u[\\\dA-Fa-f]{4}|x[\\\dA-Fa-f]{2}|[0-7]{1,3}|'|"|\\|\/|b|f|n|r|t)/
      }, {
        token: "string",
        regex: "."
      }],

      "regex": [
        {
          token: "regexp.keyword.operator",
          regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
        },
        {
          token: "string.regexp",
          regex: "/",
          next: "start"
        },
        {
          token: "string.regexp",
          regex: "[^/\\\\[]*"

        },
        {
          token: "string.regexp.escape",
          regex: /\\./
        }
        
      ]

    };
    var escapeRegex = /\\(?:u[\\\dA-Fa-f]{4}|x[\\\dA-Fa-f]{2}|[0-7]{1,3}|'|"|\\|\/|b|f|n|r|t|%|\*|\+|\-|\_|\{|\})/

        for (let i=0; i<this.$rules["start"].length; i++) {
            if (this.$rules["start"][i].token == "string.math"){
                this.$rules["start"][i].regex = new RegExp(this.$rules["start"][i].regex.source.replace(/\\./, escapeRegex.source));
            }
        }
        
    this.normalizeRules();
  };
  
  TypstHighlightRules.metaData = {
    name: "Typst",
    scopeName: "source.typst",
    fileTypes: ["typ"],  // Atau ["typst"] jika Anda menggunakan ekstensi .typst
    foldingStartMarker: /\\{/, // Contoh: Gunakan kurung kurawal untuk folding
    foldingStopMarker: /\\}/   // Contoh: Gunakan kurung kurawal untuk folding
  };

  oop.inherits(TypstHighlightRules, TextHighlightRules);
  exports.TypstHighlightRules = TypstHighlightRules;
  
});
