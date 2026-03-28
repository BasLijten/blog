const visit = require("unist-util-visit")
const { deckdeckgoHighlightCodeLanguages } = require("@deckdeckgo/highlight-code")

module.exports = ({ markdownAST }) => {
  visit(markdownAST, "code", (node) => {
    if (node.lang && !deckdeckgoHighlightCodeLanguages[node.lang]) {
      node.lang = "markup"
    }
  })
  return markdownAST
}
