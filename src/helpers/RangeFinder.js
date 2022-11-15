import * as Util from './util';

function search(element, phrase) {
  console.log("element is",element);
  console.log("phrase is",phrase);
  return Util.match(element, phrase.regex).map((range) => ({
    message: phrase.message,
    link: phrase.link,
    rangeToHighlight: range,
  }));
}

export function findRanges(node, patternsToFind) {
  console.log("inside find range",node);
  console.log("patterns to find",patternsToFind);
  return patternsToFind.flatMap((pattern) => search(node, pattern));
}
