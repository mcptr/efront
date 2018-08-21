var dot = require("dot");
var console = require("console");
var fs = require("fs");

if(process.argv.length < 4) {
	process.stderr.write("Not enough parameters\n");
	process.exit(1);
}

process.stdout.write(" [READ] ");
var content = fs.readFileSync(process.argv[2]).toString();
var result = 'define([], function() {';
process.stdout.write(" [COMPILE] ");
result += dot.compile(content).toString();
result += '\nreturn anonymous;\n});\n';
process.stdout.write(" [SAVE] ");
fs.writeFile(process.argv[3], result, function(err) {
	if(err) {
		process.stderr.write(
			"Failed to write file: " + process.argv[3] + "\n" + err + "\n"
		);
		process.exit(1);
	}
	process.stdout.write(process.argv[3] + "\n");
});
