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
    /* Accepts XML representation of a resume.
     * Returns all combinations of alternate items (except original)
     */

    const $resume = $(resumeDoc).clone();

    const $unlockedSets = $resume.find("tunable-set").not('[locked="true"]');

    if ($unlockedSets.length == 0) {
        return []; // all all sets are locked, terminate recursion
    }

    const $activeSet = $unlockedSets.first(); 
    $activeSet.attr("locked", "true"); // flag activeSet as having been altered already

    let result = [];
     
    for (let i = 0; i < $activeSet.find(hiddenTags).length; i++) {
        let $resumeCopy = $resume.clone();
        let $activeSetCopy = getActiveSetCopy($resumeCopy);
        // ordering important! get current item >> hide all items >> unhide current item
        let $currentItemCopy = $activeSetCopy.find(hiddenTags).eq(i);
        $activeSetCopy.find("item").attr("visibility", "hidden");
        $currentItemCopy.attr("visibility", "visible");

        result.push($resumeCopy);
    }

    // recursive on all of the variations of the active set
    for (let $resumeCopy of result) {
        result = result.concat(resumeCombinations($resumeCopy))
    }

    // recursive on no change (to the active set)
    result = result.concat(resumeCombinations($resume))

    return result;

    function getActiveSetCopy($resumeCopy) {
        // get copy of $activeSet in $resumeCopy
        let idx = $resume.find("tunable-set").index($activeSet);
        return $resumeCopy.find("tunable-set").eq(idx);
    }
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