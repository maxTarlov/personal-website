const processor = new XSLTProcessor;
let XMLData;
let hiddenTags = "[visibility='alternate'], [visibility='hidden']";

function renderResume(XMLData) {
    let HTMLResume = processor.transformToDocument(XMLData)
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

function extractText(resume) {
    let $resumeCopy
    if (resume instanceof XMLDocument) {
        $resumeCopy = $(resume).find("data").clone();
    }
    else {
        $resumeCopy = $(resume).clone();
    }
    $resumeCopy.find(hiddenTags).remove();
    return $resumeCopy.text()
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

function resumeCombinations(resumeDoc) {
    let $resume = $(resumeDoc).clone();
    let result = [];

    let getUnlockedTunableSets = (elem) => {
        return $(elem).find("tunable-set").not('[locked="true"]');
    }

    getUnlockedTunableSets($resume).each((setIdx, tunableSet) => {
        $(tunableSet).find(hiddenTags).each((altIdx, altElem) => {
            // let $thisAlt = $(altElem).clone();
            let $resumeCopy = $resume.clone();

            let $itemSet = getUnlockedTunableSets($resumeCopy).eq(setIdx);
            let $targetAltElem = $itemSet.find(hiddenTags).eq(altIdx);
            $itemSet.attr("locked", "true");
            $itemSet.children().not(hiddenTags).attr("visibility", "hidden");

            $targetAltElem.attr("visibility", "visible");

            // $visibleItem.empty()
            // $visibleItem.append($thisAlt.contents());
            // IMPORTANT use get(0) to get the underlying node
            renderResume($resumeCopy.get(0));
            resumeCombinations($resumeCopy);
        });
    });
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