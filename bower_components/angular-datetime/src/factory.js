angular.module("datetime").factory("datetime", function($locale){
	// Fetch date and time formats from $locale service
	var formats = $locale.DATETIME_FORMATS;
	// Valid format tokens. 1=sss, 2=''
	var tokenRE = /yyyy|yy|y|M{1,4}|dd?|EEEE?|HH?|hh?|mm?|ss?|([.,])sss|a|Z{1,2}|ww|w|'(([^']+|'')*)'/g;
	// Token definition
	var definedTokens = {
		"y": {
			minLength: 1,
			maxLength: 4,
			min: 1,
			max: 9999,
			name: "year",
			type: "number",
			mutable: true
		},
		"yy": {
			minLength: 2,
			maxLength: 2,
			min: 1,
			max: 99,
			name: "year",
			type: "number",
			mutable: true
		},
		"yyyy": {
			minLength: 4,
			maxLength: 4,
			min: 1,
			max: 9999,
			name: "year",
			type: "number",
			mutable: true
		},
		"MMMM": {
			name: "month",
			type: "select",
			select: formats.MONTH,
			mutable: true
		},
		"MMM": {
			name: "month",
			type: "select",
			select: formats.SHORTMONTH,
			mutable: true
		},
		"MM": {
			minLength: 2,
			maxLength: 2,
			min: 1,
			max: 12,
			name: "month",
			type: "number",
			mutable: true
		},
		"M": {
			minLength: 1,
			maxLength: 2,
			min: 1,
			max: 12,
			name: "month",
			type: "number",
			mutable: true
		},
		"dd": {
			minLength: 2,
			maxLength: 2,
			min: 1,
			max: 31,
			name: "date",
			type: "number",
			mutable: true
		},
		"d": {
			minLength: 1,
			maxLength: 2,
			min: 1,
			max: 31,
			name: "date",
			type: "number",
			mutable: true
		},
		"EEEE": {
			name: "day",
			type: "select",
			select: fixDay(formats.DAY),
			mutable: true
		},
		"EEE": {
			name: "day",
			type: "select",
			select: fixDay(formats.SHORTDAY),
			mutable: true
		},
		"HH": {
			minLength: 2,
			maxLength: 2,
			min: 0,
			max: 23,
			name: "hour",
			type: "number",
			mutable: true
		},
		"H": {
			minLength: 1,
			maxLength: 2,
			min: 0,
			max: 23,
			name: "hour",
			type: "number",
			mutable: true
		},
		"hh": {
			minLength: 2,
			maxLength: 2,
			min: 1,
			max: 12,
			name: "hour12",
			type: "number",
			mutable: true
		},
		"h": {
			minLength: 1,
			maxLength: 2,
			min: 1,
			max: 12,
			name: "hour12",
			type: "number",
			mutable: true
		},
		"mm": {
			minLength: 2,
			maxLength: 2,
			min: 0,
			max: 59,
			name: "minute",
			type: "number",
			mutable: true
		},
		"m": {
			minLength: 1,
			maxLength: 2,
			min: 0,
			max: 59,
			name: "minute",
			type: "number",
			mutable: true
		},
		"ss": {
			minLength: 2,
			maxLength: 2,
			min: 0,
			max: 59,
			name: "second",
			type: "number",
			mutable: true
		},
		"s": {
			minLength: 1,
			maxLength: 2,
			min: 0,
			max: 59,
			name: "second",
			type: "number",
			mutable: true
		},
		"sss": {
			minLength: 3,
			maxLength: 3,
			min: 0,
			max: 999,
			name: "millisecond",
			type: "number",
			mutable: true
		},
		"a": {
			name: "ampm",
			type: "select",
			select: formats.AMPMS,
			mutable: true
		},
		"ww": {
			minLength: 2,
			maxLength: 2,
			min: 0,
			max: 53,
			name: "week",
			type: "number",
			mutable: true
		},
		"w": {
			minLength: 1,
			maxLength: 2,
			min: 0,
			max: 53,
			name: "week",
			type: "number",
			mutable: true
		},
		"Z": {
			name: "timezone",
			type: "regex",
			regex: /[+-]\d{4}/
		},
		"ZZ": {
			name: "timezoneWithColon",
			type: "regex",
			regex: /[+-]\d{2}:\d{2}/
		},
		"string": {
			name: "string",
			type: "static"
		}
	};
	
	var SYS_TIMEZONE = (function(){
		var offset = -(new Date).getTimezoneOffset(),
			sign = offset >= 0 ? "+" : "-",
			absOffset = Math.abs(offset),
			hour = Math.floor(absOffset / 60),
			min = absOffset % 60;
		return sign + num2str(hour, 2, 2) + num2str(min, 2, 2);
	})();

	// Push Sunday to the end
	function fixDay(days) {
		var s = [], i;
		for (i = 1; i < days.length; i++) {
			s.push(days[i]);
		}
		s.push(days[0]);
		return s;
	}

	// Use localizable formats
	function getFormat(format) {
		return formats[format] || format;
	}
	
	function placehold(token) {
		return "(" + token.name + ")";
	}
	
	function Node(token) {
		this.token = token;
		this.value = null;
		this.viewValue = token.value || placehold(token);
		this.offset = 0;
		this.next = null;
		this.prev = null;
		this.nextEdit = null;
		this.prevEdit = null;
		this.empty = true;
	}
	
	Node.prototype.unset = function() {
		if (!this.token.mutable) {
			return;
		}
		this.empty = true;
		this.value = null;
		this.viewValue = placehold(this.token);
		
		// Update offset
		var node = this.next;
		while (node) {
			node.offset = node.prev.offset + node.prev.viewValue.length;
			node = node.next;
		}
	};
	
	// Split format into multiple tokens
	function createTokens(format) {
		var tokens = [],
			pos = 0,
			match;
			
		while ((match = tokenRE.exec(format))) {
			if (match.index > pos) {
				// doesn't match any token, static string
				tokens.push(angular.extend({
					value: format.substring(pos, match.index)
				}, definedTokens.string));
				pos = match.index;
			} 

			if (match.index == pos) {
				if (match[1]) {
					// sss
					tokens.push(angular.extend({
						value: match[1]
					}, definedTokens.string));
					tokens.push(definedTokens.sss);
				} else if (match[2]) {
					// escaped string
					tokens.push(angular.extend({
						value: match[2].replace("''", "'")
					}, definedTokens.string));
				} else {
					// other tokens
					tokens.push(definedTokens[match[0]]);
				}
				pos = tokenRE.lastIndex;
			}
		}
		
		if (pos < format.length) {
			tokens.push(angular.extend({
				value: format.substring(pos)
			}, definedTokens.string));
		}
		
		return tokens;
	}

	// Create node list from tokens
	function createNodes(tokens) {
		var nodes = [],
			edit,
			i;
			
		for (i = 0; i < tokens.length; i++) {
			nodes.push(new Node(tokens[i]));
		}
		
		// Build relationship between nodes
		for (i = 0; i < nodes.length; i++) {
			nodes[i].next = nodes[i + 1] || null;
			nodes[i].prev = nodes[i - 1] || null;
		}
		
		edit = null;
		for (i = 0; i < nodes.length; i++) {
			nodes[i].prevEdit = edit;
			if (nodes[i].token.mutable) {
				edit = nodes[i];
			}
		}
		
		edit = null;
		for (i = nodes.length - 1; i >= 0; i--) {
			nodes[i].nextEdit = edit;
			if (nodes[i].token.mutable) {
				edit = nodes[i];
			}
		}

		return nodes;
	}

	function getInteger(str, pos) {
		str = str.substring(pos);
		var match = str.match(/^\d+/);
		return match && match[0];
	}

	function getMatch(str, pos, pattern) {
		var i = 0,
			strQ = str.toUpperCase(),
			patternQ = pattern.toUpperCase();

		while (strQ[pos + i] && strQ[pos + i] == patternQ[i]) {
			i++;
		}

		return str.substr(pos, i);
	}

	function getWeek(date) {
		var yearStart = new Date(date.getFullYear(), 0, 1);

		var weekStart = new Date(yearStart.getTime());

		if (weekStart.getDay() > 4) {
			weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()) + 7);
		} else {
			weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()));
		}
		var diff = date.getTime() - weekStart.getTime();

		return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
	}

	function num2str(num, minLength, maxLength) {
		var i;
		num = "" + num;
		if (num.length > maxLength) {
			num = num.substr(num.length - maxLength);
		} else if (num.length < minLength) {
			for (i = num.length; i < minLength; i++) {
				num = "0" + num;
			}
		}
		return num;
	}
	
	function insertColon(timezone) {
		if (timezone[3] == ":") {
			return timezone;
		}
		return timezone.substr(0, 3) + ":" + timezone.substr(3, 2);
	}
	
	function removeColon(timezone) {
		if (timezone[3] != ":") {
			return timezone;
		}
		return timezone.substr(0, 3) + timezone.substr(4, 2);
	}
	
	function getValue(date, token, timezone) {
		// format value from @date according to @token.
		var value;
		switch (token.name) {
			case "year":
				value = date.getFullYear();
				// it is possible
				if (value < 0) {
					value = 0;
				}
				break;
			case "month":
				value = date.getMonth() + 1;
				break;
			case "date":
				value = date.getDate();
				break;
			case "day":
				value = date.getDay() || 7;
				break;
			case "hour":
				value = date.getHours();
				break;
			case "hour12":
				value = date.getHours() % 12 || 12;
				break;
			case "ampm":
				value = date.getHours() < 12 ? 1 : 2;
				break;
			case "minute":
				value = date.getMinutes();
				break;
			case "second":
				value = date.getSeconds();
				break;
			case "millisecond":
				value = date.getMilliseconds();
				break;
			case "week":
				value = getWeek(date);
				break;
			case "timezone":
				value = removeColon(timezone || SYS_TIMEZONE);
				break;
			case "timezoneWithColon":
				value = insertColon(timezone || SYS_TIMEZONE);
				break;
		}
		return value;
	}
	
	function getViewValue(value, token) {
		// format viewValue from @value and @token
		switch (token.type) {
			case "number":
				return num2str(value, token.minLength, token.maxLength);
			case "select":
				return token.select[value - 1];
		}
		return value + "";
	}
	
	// set the proper date value matching the weekday
	function setDay(date, day) {
		// we don't want to change month when changing date
		var month = date.getMonth(),
			diff = day - (date.getDay() || 7);
		// move to correct date
		date.setDate(date.getDate() + diff);
		// check month
		if (date.getMonth() != month) {
			if (diff > 0) {
				date.setDate(date.getDate() - 7);
			} else {
				date.setDate(date.getDate() + 7);
			}
		}
	}

	function setHour12(date, hour) {
		hour = hour % 12;
		if (date.getHours() >= 12) {
			hour += 12;
		}
		date.setHours(hour);
	}

	function setAmpm(date, ampm) {
		var hour = date.getHours();
		if ((hour < 12) == (ampm > 1)) {
			date.setHours((hour + 12) % 24);
		}
	}

	function setDate(date, value, token) {
		switch (token.name) {
			case "year":
				date.setFullYear(value);
				break;
			case "month":
				// http://stackoverflow.com/questions/14680396/the-date-getmonth-method-has-bug
				date.setMonth(value - 1);
				// handle date overflow
				if (date.getMonth() == value) {
					date.setDate(0);
				}
				break;
			case "date":
				date.setDate(value);
				break;
			case "day":
				setDay(date, value);
				break;
			case "hour":
				date.setHours(value);
				break;
			case "hour12":
				setHour12(date, value);
				break;
			case "ampm":
				setAmpm(date, value);
				break;
			case "minute":
				date.setMinutes(value);
				break;
			case "second":
				date.setSeconds(value);
				break;
			case "millisecond":
				date.setMilliseconds(value);
				break;
			case "week":
				date.setDate(date.getDate() + (value - getWeek(date)) * 7);
				break;
		}

		if (date.getFullYear() < 0) {
			date.setFullYear(0);
		}
	}

	// Re-calculate offset
	function calcOffset(nodes) {
		var i, offset = 0;
		for (i = 0; i < nodes.length; i++) {
			nodes[i].offset = offset;
			offset += nodes[i].viewValue.length;
		}
	}

	// Parse text[pos:] by node.token definition.
	function parseNode(text, token, pos) {
		var m, match, value, j;
		if (token.mutable) {
			var ph = placehold(token);
			if (text.indexOf(ph, pos) == pos) {
				return {
					empty: true,
					viewValue: ph
				};
			}
		}
		switch (token.type) {
			case "static":
				if (text.lastIndexOf(token.value, pos) != pos) {
					return {
						err: 2,
						code: "TEXT_MISMATCH",
						message: "Pattern value mismatch"
					};
				}
				return {
					viewValue: token.value
				};

			case "number":
				value = getInteger(text, pos);
				
				if (value == null) {
					return {
						err: 2,
						code: "NUMBER_MISMATCH",
						message: "Invalid number"
					};
				}
				
				if (value.length < token.minLength) {
					return {
						err: 1,
						code: "NUMBER_TOOSHORT",
						message: "The length of number is too short",
						value: +value,
						viewValue: value,
						properValue: num2str(+value, token.minLength, token.maxLength)
					};
				}

				if (value.length > token.maxLength) {
					value = value.substr(0, token.maxLength);
				}

				if (+value < token.min) {
					return {
						err: 1,
						code: "NUMBER_TOOSMALL",
						message: "The number is too small",
						value: +value,
						viewValue: value
					};
				}

				if (value.length > token.minLength && value[0] == "0") {
					return {
						err: 1,
						code: "LEADING_ZERO",
						message: "The number has too many leading zero",
						value: +value,
						viewValue: value,
						properValue: num2str(+value, token.minLength, token.maxLength)
					};
				}
				
				return {
					value: +value,
					viewValue: value
				};

			case "select":
				match = "";
				for (j = 0; j < token.select.length; j++) {
					m = getMatch(text, pos, token.select[j]);
					if (m && m.length > match.length) {
						value = j;
						match = m;
					}
				}
				if (!match) {
					return {
						err: 2,
						code: "SELECT_MISMATCH",
						message: "Invalid select"
					};
				}

				if (match != token.select[value]) {
					return {
						err: 1,
						code: "SELECT_INCOMPLETE",
						message: "Incomplete select",
						value: value + 1,
						viewValue: match,
						selected: token.select[value]
					};
				}

				return {
					value: value + 1,
					viewValue: match
				};

			case "regex":
				m = token.regex.exec(text.substr(pos));
				if (!m || m.index != 0) {
					return {
						err: 2,
						code: "REGEX_MISMATCH",
						message: "Regex doesn't match"
					};
				}
				return {
					value: m[0],
					viewValue: m[0]
				};
		}
	}

	function addDate(date, token, diff) {
		var value;
		switch (token.name) {
			case "year":
				date.setFullYear(date.getFullYear() + diff);
				break;
			case "month":
				value = date.getMonth() + diff;
				date.setMonth(value);
				// date overflow
				if (date.getMonth() == value + 1) {
					date.setDate(0);
				}
				break;
			case "date":
			case "day":
				date.setDate(date.getDate() + diff);
				break;
			case "hour":
			case "hour12":
				date.setHours(date.getHours() + diff);
				break;
			case "ampm":
				date.setHours(date.getHours() + diff * 12);
				break;
			case "minute":
				date.setMinutes(date.getMinutes() + diff);
				break;
			case "second":
				date.setSeconds(date.getSeconds() + diff);
				break;
			case "millisecond":
				date.setMilliseconds(date.getMilliseconds() + diff);
				break;
			case "week":
				date.setDate(date.getDate() + diff * 7);
				break;
		}
	}
	
	function parse(text, tokens) {
		var i, pos = 0, l = [], result;
		for (i = 0; i < tokens.length; i++) {
			result = parseNode(text, tokens[i], pos);
			result.index = i;
			result.pos = pos;
			if (result.err >= 2) {
				result.text = text;
				throw result;
			}
			pos += result.viewValue.length;
			l.push(result);
		}
		return l;
	}
	
	var priorTable = {
		millisecond: 1,
		second: 1,
		minute: 1,
		hour: 2,
		hour12: 2,
		ampm: 3,
		day: 4,
		date: 4,
		week: 6,
		month: 5,
		year: 7
	};
	
	function compareType(a, b) {
		if (a.result.empty) {
			return -1;
		}
		if (b.result.empty) {
			return 1;
		}
		return priorTable[a.token.type] - priorTable[b.token.type];
	}
	
	// Main parsing loop. Loop through nodes, parse text, update date model.
	function parseLoop(nodes, tokens, text, date) {
		var result = parse(text, tokens);
		
		// throw error
		var i;
		for (i = 0; i < result.length; i++) {
			if (result[i].err) {
				throw result[i];
			}
		}
		
		// throw TEXT_TOOLONG error
		var last = result[result.length - 1];
		if (last.pos + last.viewValue.length > text.length) {
			throw {
				code: "TEXT_TOOLONG",
				message: "Text is too long",
				text: text
			};
		}

		// grab changed nodes
		var changed = [];
		for (i = 0; i < result.length; i++) {
			if (result[i].viewValue != nodes[i].viewValue) {
				changed.push({
					node: nodes[i],
					token: tokens[i],
					result: result[i]
				});
			}
		}
		
		// apply date
		changed.sort(compareType);
		for (i = changed.length - 1; i >= 0; i--) {
			setDate(date, changed[i].result.value, changed[i].token);
		}
		
		return result;
	}
	
	function deOffsetDate(date, timezone) {
		timezone = removeColon(timezone);
		var hour = +timezone.substr(1, 2),
			min = +timezone.substr(3, 2),
			sig = (timezone[0] + "1"),
			offset = (hour * 60 + min) * sig;
		
		return new Date(date.getTime() + (-date.getTimezoneOffset() - offset) * 60 * 1000);
	}
	
	function offsetDate(date, timezone) {
		timezone = removeColon(timezone);
		var hour = +timezone.substr(1, 2),
			min = +timezone.substr(3, 2),
			sig = (timezone[0] + "1"),
			offset = (hour * 60 + min) * sig;
			
		return new Date(date.getTime() + (offset - -date.getTimezoneOffset()) * 60 * 1000);
	}
	
	function applyDate(date, nodes, timezone){
		// extract date to node values
		var i;
		for (i = 0; i < nodes.length; i++) {
			if (nodes[i].token.name == "string") {
				continue;
			}
			if (!nodes[i].empty) {
				nodes[i].value = getValue(date, nodes[i].token, timezone);
				nodes[i].viewValue = getViewValue(nodes[i].value, nodes[i].token);
			} else {
				nodes[i].value = null;
				nodes[i].viewValue = placehold(nodes[i].token);
			}
		}
		calcOffset(nodes);
	}
	
	function getNodesText(date, nodes, tokens, timezone) {
		var i, text = "";
		for (i = 0; i < nodes.length; i++) {
			if (tokens[i].name == "string") {
				text += tokens[i].value;
			} else if (nodes[i].empty) {
				text += placehold(tokens[i]);
			} else {
				text += getViewValue(getValue(date, tokens[i], timezone), tokens[i]);
			}
		}
		return text;
	}
	
	function createParser(format) {

		format = getFormat(format);
		
		var tokens = createTokens(format);
		var nodes = createNodes(tokens);

		var parser = {
			parse: function(text) {
				var oldDate = parser.date,
					date = new Date(oldDate.getTime()),
					oldText = parser.getText(),
					newText;

				if (!text) {
					throw {
						code: "EMPTY",
						message: "The input is empty",
						oldText: oldText
					};
				}
				
				var result;

				try {
					result = parseLoop(nodes, tokens, text, date);
				} catch (err) {
					if (angular.isDefined(err.index)) {
						err.node = nodes[err.index];
					}
					throw err;
				}

				// check date consistency
				newText = getNodesText(date, result, tokens, parser.timezoneNode && parser.timezoneNode.viewValue);
				if (text != newText) {
					throw {
						code: "INCONSISTENT_INPUT",
						message: "Successfully parsed but the output text doesn't match the input",
						text: text,
						oldText: oldText,
						properText: newText
					};
				}
				
				// everything is ok, copy result value into nodes
				var i;
				for (i = 0; i < result.length; i++) {
					nodes[i].value = result[i].value;
					nodes[i].viewValue = result[i].viewValue;
					nodes[i].offset = result[i].pos;
					nodes[i].empty = result[i].empty;
				}
				
				// check if Z token exists
				if (parser.timezoneNode) {
					parser.setTimezone(parser.timezoneNode.viewValue);
				}

				// de-offset and save to model
				parser.date = date;
				if (parser.timezone) {
					parser.model = deOffsetDate(date, parser.timezone);
				} else {
					parser.model = new Date(date.getTime());
				}
				
				// check uninit node
				for (i = 0; i < parser.nodes.length; i++) {
					if (parser.nodes[i].empty) {
						throw {
							code: "NOT_INIT",
							message: "Some date parts are empty",
							text: text,
							node: parser.nodes[i]
						};
					}
				}
				
				return parser;
			},
			nodeParseValue: function(node, text) {
				var date = parser.date,
					result = parseNode(text, node.token, 0);
					
				if (result.err) {
					throw result;
				}
				
				node.viewValue = result.viewValue;
				node.value = result.value;
				node.empty = result.empty;
				
				calcOffset(parser.nodes);
				
				if (node.empty) {
					return;
				}
				setDate(date, node.value, node.token);
				applyDate(date, parser.nodes, parser.timezone);
				if (parser.timezone) {
					parser.model = deOffsetDate(date, parser.timezone);
				} else {
					parser.model = new Date(date.getTime());
				}
				return parser;
			},
			nodeAddValue: function(node, diff) {
				var date = parser.date;
				node.empty = false;
				addDate(date, node.token, diff);
				applyDate(date, parser.nodes, parser.timezone);
				if (parser.timezone) {
					parser.model = deOffsetDate(date, parser.timezone);
				} else {
					parser.model = new Date(date.getTime());
				}
				return parser;
			},
			setDate: function(date){
				parser.model = new Date(date.getTime());
				if (parser.timezone) {
					parser.date = offsetDate(date, parser.timezone);
				} else {
					parser.date = new Date(date.getTime());
				}
				// init all parts
				var i;
				for (i = 0; i < parser.nodes.length; i++) {
					parser.nodes[i].empty = false;
				}
				applyDate(parser.date, parser.nodes, parser.timezone);
				return parser;
			},
			getDate: function(){
				return parser.model;
			},
			getText: function(timezone){
				var i, text = "";
				if (timezone) {
					var date = offsetDate(parser.model, timezone);
					text = getNodesText(date, nodes, tokens, timezone);
				} else {
					for (i = 0; i < parser.nodes.length; i++) {
						text += parser.nodes[i].viewValue;
					}
				}
				return text;
			},
			setTimezone: function(timezone){
				if (!timezone) {
					timezone = SYS_TIMEZONE;
				}
				if (timezone != parser.timezone) {
					parser.timezone = timezone;
					parser.date = offsetDate(parser.model, timezone);
					applyDate(parser.date, parser.nodes, timezone);
				}
			},
			unset: function(){
				var i;
				for (i = 0; i < nodes.length; i++) {
					nodes[i].unset();
				}
				calcOffset(nodes);
			},
			isEmpty: function(text){
				var l, i;
				if (text) {
					try {
						l = parse(text, parser.tokens);
					} catch (err) {
						return false;
					}
				} else {
					l = nodes;
				}
				for (i = 0; i < l.length; i++) {
					if (parser.tokens[i].mutable && !l[i].empty) {
						return false;
					}
				}
				return true;
			},
			date: null,
			model: null,
			format: format,
			nodes: nodes,
			tokens: tokens,
			timezone: null,
			timezoneNode: null
		};

		// get timezone node
		var node = parser.nodes[0];
		while (node) {
			if (node.token.name == "timezone" || node.token.name == "timezoneWithColon") {
				parser.timezoneNode = node;
				break;
			}
			node = node.next;
		}
		
		parser.setDate(new Date());
		
		return parser;
	}

	return createParser;
});
