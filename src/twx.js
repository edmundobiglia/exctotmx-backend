const TSV = [
  ["I love you", "Eu te amo"],
  ["Please help me", "Me ajude"],
  ["How can you see into my eyes", "Como você vê dentro dos meus olhos"],
];

const createSegment = (sourceLanguage, targetLanguage, source, translation) => {
  const segment = `<tu><tuv xml:lang="${sourceLanguage}"><seg>${source}</seg></tuv><tuv xml:lang="${targetLanguage}"><seg>${translation}</seg></tuv></tu>`;

  return segment;
};

const createSegments = (segmentList, sourceLanguage, targetLanguage) => {
  const createdSegments = segmentList.map(([source, target]) => {
    return createSegment(sourceLanguage, targetLanguage, source, target);
  });

  return createdSegments;
};

const stringifySegments = (segmentArray) => {
  const strigifiedSegments = segmentArray.join("");

  return strigifiedSegments;
};

const assembleTwx = (header, segments, footer) => {
  const fullTwx = `${header}${segments}${footer}`;

  return fullTwx;
};

const createHeader = (sourceLanguage, targetLanguage) => {
  const header = `<?xml version="1.0"?>
<tmx version="1.4">
    <header creationtool="Apertium TMX Builder"
        creationtoolversion="3.6.3"
        segtype="sentence"
        srclang="${sourceLanguage}"
        adminlang="${targetLanguage}"
        datatype="plaintext"
        o-tmf="none"></header>
    <body>`;

  return header;
};

const createFooter = () => {
  const footer = `</body></tmx>`;

  return footer;
};
