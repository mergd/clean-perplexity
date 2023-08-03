export default function removeCitations(text) {
  const citationsRegex = /\[.*?\]/;
  const citationsSectionRegex = /Citations:\n(.*?)\n/;

  text = text.replace(citationsRegex, "");
  text = text.replace(citationsSectionRegex, "");

  return text;
}
