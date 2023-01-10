const processor = new XSLTProcessor;
let XMLData;

function renderResume(XMLData) {
    HTMLResume = processor.transformToDocument(XMLData)
    .getElementById("resume-body");

    if(!(HTMLResume instanceof HTMLElement)) {
        throw new Error("Failed to process XML with XSLTProcessor");
    } 

    if($("#resume-redirect").length) {
        $("#resume-redirect").replaceWith(HTMLResume);
    }
    else if($("#resume-body").length) {
        $("#resume-body").replaceWith(HTMLResume);
    }
    else {
        throw new Error("Failed to find #resume-redirect or #resume-body");
    }
}

function extractText(resume, tweakableElements="item, job-title, degree") {
    let $resume = $(resume);
    let result = [];
    $resume.find(tweakableElements).contents().each(function (_, node) {
        if (node.nodeType === 3) {result.push(node.textContent.trim());}
    })
    return result.join(' ');
}

function scoreKeywords(docText, keywords) {
    /* compiling the keywords makes lookups super fast, see:
     * https://observablehq.com/@spencermountain/compromise-match
     * We also need the keywords to be normalized.
     */
    let kwdsNormalized = keywords.map(kw => nlp(kw).out('normal'));
    let kwdsCompiled = nlp.compile(kwdsNormalized);

    // count the occurances of each keyword
    let counts = {};
    let doc = nlp(docText);
    doc.lookup(kwdsCompiled).forEach(function (keyword) {
        let kw = keyword.out('normal');
        if (counts[kw]) {
            counts[kw]++;
        }
        else {counts[kw] = 1;}
    })

    // generate a score using the counts of each keyword
    let result = 0
    for (let x of Object.values(counts)) {
        result = result + 1 - 1/(1+x);
    }
    return result/keywords.length;
}

function scoreLength(docText, originalLength=nlp(extractText(XMLData)).wordCount()) {
    let x = (originalLength - nlp(docText).wordCount())/originalLength;
    return 1/(1+x**2);
}

function scoreResume(docText, keywords) {
    let keywordScore = scoreKeywords(docText, keywords);
    let lengthScore = scoreLength(docText);
    return (keywordScore + lengthScore)/2
}

$(document).ready(async function() { 
    XMLData = await $.get("/assets/data/resume.xml").fail(function() {
        console.error("Failed to fetch XML resume")
    });
    $.get('assets/data/resume.xsl', function(data) {
        processor.importStylesheet(data);
    }).done(function() {
        renderResume(XMLData);
    }).fail(function() {
        console.error("Failed to fetch XSL stylesheet");
    });
});