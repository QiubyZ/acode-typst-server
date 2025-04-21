ace.define(
	"ace/mode/typst",
	[
		"require",
		"exports",
		"module",
		"ace/lib/oop",
		"ace/mode/text",
		"ace/mode/text_highlight_rules",
		"ace/mode/behaviour",
		"ace/autocomplete",
		"ace/ext/language_tools",
	],
	function (require, exports, module) {
		"use strict";

		var oop = require("../lib/oop");
		var TextMode = require("./text").Mode;
		var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
		var Behaviour = require("./behaviour").Behaviour;
		var Autocomplete = require("../autocomplete");
		var langTools = require("../ext/language_tools");

		// Define Highlight Rules for Typst
		var TypstHighlightRules = function () {
			// Comprehensive list of keywords and built-in functions
			var keywords = (
				"let|if|else|for|while|fn|include|import|show|set|output|image|" +
				"block|line|grid|repeat|range|cycle|counter|enum|" +
				"math|align|stack|columns|rows|box|frame|rule|" +
				"raw|text|heading|paragraph|quote|list|item|" +
				"table|cell|row|column|header|footer|" +
				"page|margin|size|width|height|scale|" +
				"color|fill|stroke|opacity|blend|" +
				"rotate|translate|scale|transform|" +
				"circle|ellipse|rect|path|polygon|polyline|" +
				"arc|sector|segment|curve|bezier|" +
				"link|ref|cite|bibliography|footnote|" +
				"date|time|duration|interval|" +
				"true|false|null"
			).split("|");

			// Built-in functions
			var builtinFunctions = (
				"abs|acos|asin|atan|ceil|cos|exp|floor|ln|log|round|sin|sqrt|tan|" +
				"rgb|cmyk|hsb|hsl|gray|" +
				"upper|lower|roman|digits|" +
				"underline|overline|strike|smallcaps|" +
				"hyphenate|smartquotes|nobreak|" +
				"url|email|strong|emph|super|sub|expand|" +
				"pagebreak|columnbreak|" +
				"locate|numbering|symbols"
			) // Added more functions
				.split("|");

			// Built-in classes (Typst has structs that behave like classes)
			var builtinClasses = (
				"Length|Angle|Ratio|Relative|Em|Ex|Fr|Pt|Mm|Cm|In|Dp|Dc|Dd|" +
				"Color|Image|Font|Duration|Datetime|None"
			) // Added classes
				.split("|");

			// Variables
			var builtinVariables = "page-width|page-height|page-number|total-pages|today".split(
				"|",
			);

			this.$rules = {
				start: [
					{ token: "comment", regex: /\/\/.*$/ },
					{ token: "string", regex: /"(?:[^\\"]|\\.)*"/ },
					{ token: "constant.numeric", regex: /\b\d+(\.\d+)?\b/ },
					{
						token: "keyword",
						regex: "\\b(?:" + keywords.join("|") + ")\\b",
					},
					{
						token: "support.function",
						regex: "\\b(?:" + builtinFunctions.join("|") + ")\\b",
					},
					{
						token: "support.class",
						regex: "\\b(?:" + builtinClasses.join("|") + ")\\b",
					},
					{
						token: "variable.language",
						regex: "\\b(?:" + builtinVariables.join("|") + ")\\b",
					},
					{ token: "paren.lparen", regex: "[\\[({]" },
					{ token: "paren.rparen", regex: "[\\])]}" },
					{ token: "operator", regex: /[+\-*/%=<>!&|^~]+/ },
					{ token: "variable", regex: /[a-zA-Z_$][a-zA-Z0-9_$]*/ }, // Identifiers
				],
			};
			this.normalizeRules();
		};

		oop.inherits(TypstHighlightRules, TextHighlightRules);

		// Define Behaviour for Typst
		var TypstBehaviour = function () {
			this.add("braces", "insertion", function (state, action, editor, session, text) {
				if (text === "{") return { text: "{}", selection: [1, 1] };
			});
			this.add("colon", "insertion", function (state, action, editor, session, text) {
				if (text === ":" && editor.selection.isEmpty()) {
					var cursor = editor.getCursorPosition();
					var line = session.doc.getLine(cursor.row);
					var rightChar = line.substring(cursor.column, cursor.column + 1);
					if (rightChar === ":") return { text: "", selection: [1, 1] };
					return { text: ": ", selection: [1, 1] };
				}
			});
			this.add("comment", "insertion", function (state, action, editor, session, text) {
				if (text === "/" && editor.selection.isEmpty()) {
					var cursor = editor.getCursorPosition();
					var line = session.doc.getLine(cursor.row);
					if (line.trim().startsWith("//")) return { text: "", selection: [1, 1] };
					return { text: "// ", selection: [3, 3] };
				}
			});
		};

		oop.inherits(TypstBehaviour, Behaviour);

		// Define Mode for Typst
		var Mode = function () {
			this.HighlightRules = TypstHighlightRules;
			this.$behaviour = new TypstBehaviour();
			// langTools.addCompleter(this.completer); // Add completer to language tools
		};

		oop.inherits(Mode, TextMode);

		(function () {
			this.lineCommentStart = "//";
			this.$id = "ace/mode/typst";

			// Add custom completer for autocomplete
			this.completer = {
				getCompletions: function (editor, session, pos, prefix, callback) {
					var keywords = (
						"let|if|else|for|while|fn|include|import|show|set|output|image|" +
						"block|line|grid|repeat|range|cycle|counter|enum|" +
						"math|align|stack|columns|rows|box|frame|rule|" +
						"raw|text|heading|paragraph|quote|list|item|" +
						"table|cell|row|column|header|footer|" +
						"page|margin|size|width|height|scale|" +
						"color|fill|stroke|opacity|blend|" +
						"rotate|translate|scale|transform|" +
						"circle|ellipse|rect|path|polygon|polyline|" +
						"arc|sector|segment|curve|bezier|" +
						"link|ref|cite|bibliography|footnote|" +
						"date|time|duration|interval|" +
						"true|false|null"
					).split("|");

					var builtinFunctions = (
						"abs|acos|asin|atan|ceil|cos|exp|floor|ln|log|round|sin|sqrt|tan|" +
						"rgb|cmyk|hsb|hsl|gray|" +
						"upper|lower|roman|digits|" +
						"underline|overline|strike|smallcaps|" +
						"hyphenate|smartquotes|nobreak|" +
						"url|email|strong|emph|super|sub|expand|" +
						"pagebreak|columnbreak|" +
						"locate|numbering|symbols"
					).split("|");

					var builtinClasses = (
						"Length|Angle|Ratio|Relative|Em|Ex|Fr|Pt|Mm|Cm|In|Dp|Dc|Dd|" +
						"Color|Image|Font|Duration|Datetime|None"
					).split("|");

					var builtinVariables =
						"page-width|page-height|page-number|total-pages|today".split("|");

					var allWords = keywords
						.concat(builtinFunctions)
						.concat(builtinClasses)
						.concat(builtinVariables);

					var completions = allWords.map(function (word) {
						return {
							caption: word,
							value: word,
							meta: "keyword", // Or "function", "class", etc.
						};
					});

					callback(null, completions);
				},
			};
		}).call(Mode.prototype);

		exports.Mode = Mode;
	},
);
