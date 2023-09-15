#!/usr/bin/env node
"use strict";

const fs = require("fs");
// https://github.com/tj/commander.js#quick-start
const { program } = require("commander");

// https://www.w3.org/WAI/standards-guidelines/act/report/earl/
// https://www.w3.org/WAI/standards-guidelines/act/report/earl/#assertion
const Outcome = {
  CANT_TELL: "earl:cantTell",
  FAILED: "earl:failed",
  INAPPLICABLE: "earl:inapplicable",
  PASSED: "earl:passed",
  UNTESTED: "earl:untested",
};

program.option(
  "--outcome <outcome...>",
  "Outcome to show. Use multiple time for multiple outcomes.",
  [Outcome.FAILED],
);

program.parse();

const options = program.opts();

const outcomes = options.outcome;
const invalidOutcomes = outcomes.filter(
  (outcome) => !Object.values(Outcome).includes(outcome),
);
if (invalidOutcomes.length > 0) {
  process.stderr.write(`Invalid outcomes: ${invalidOutcomes.join(", ")}\n`);
  process.exit(1);
}

const filenames = program.args;

filenames.forEach((filename) => {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      process.stderr.write(`Error: ${err}\n`);
      return;
    }
    const report = JSON.parse(data);
    renderReport(report);
  });
});

const writeLine = (line) => process.stdout.write(line + "\n");
const newLine = () => writeLine("");

const renderReport = (report) => {
  report["@graph"].forEach((subject) => {
    let first = true;

    // Group assertions by outcome
    const groupedAssertions = {};
    subject.assertions.forEach((assertion) => {
      const outcome = assertion.result.outcome;
      if (!groupedAssertions[outcome]) {
        groupedAssertions[outcome] = [];
      }
      groupedAssertions[outcome].push(assertion);
    });

    outcomes.forEach((outcome) => {
      if (
        outcome in groupedAssertions &&
        groupedAssertions[outcome].length > 0
      ) {
        if (first) {
          writeLine(`# Source: <${subject.source}>`);
          newLine();
          first = false;
        }

        writeLine(`## Outcome: \`${outcome}\``);
        newLine();

        groupedAssertions[outcome].forEach((assertion, index) => {
          const label = `${index + 1}. `;
          const indent = label.replace(/./g, " ");
          writeLine(`${label}${assertion.test.title}`);
          newLine();
          writeLine(`${indent}${assertion.result.description}`);
          newLine();
        });
      }
    });
  });
};
