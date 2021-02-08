class Tmx {
  sourceLanguage: string;
  targetLanguage: string;
  segments: string[][];

  constructor(sourceLanguage: string, targetLanguage: string, segments: string[][]) {
    this.sourceLanguage = sourceLanguage;
    this.targetLanguage = targetLanguage;
    this.segments = segments;
  }

  createHeader() {
    const header = `<?xml version="1.0"?>
    <tmx version="1.4">
    <header creationtool="Apertium TMX Builder"
        creationtoolversion="3.6.3"
        segtype="sentence"
        srclang="${this.sourceLanguage}"
        adminlang="${this.targetLanguage}"
        datatype="plaintext"
        o-tmf="none">
    </header>
    <body>`;

    return header;
  }

  createFooter() {
    const footer = `</body></tmx>`;

    return footer;
  }

  createSegment(source: string, translation: string) {
    const segment = `<tu><tuv xml:lang="${this.sourceLanguage}"><seg>${source}</seg></tuv><tuv xml:lang="${this.targetLanguage}"><seg>${translation}</seg></tuv></tu>`;

    return segment;
  }

  createSegments() {
    const createdSegments = this.segments.map(([source, target]) => {
      return this.createSegment(source, target);
    });

    return createdSegments;
  }

  stringifySegments = (segmentArray: string[]): string => {
    const strigifiedSegments = segmentArray.join("");

    return strigifiedSegments;
  };

  assembleTwx = () => {
    const header = this.createHeader();
    const footer = this.createFooter();
    const segments = this.createSegments();
    const stringifiedSegments = this.stringifySegments(segments);

    const fullTwx = `${header}${stringifiedSegments}${footer}`;

    return fullTwx;
  };
}

export default Tmx;
