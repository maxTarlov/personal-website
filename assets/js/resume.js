const processor = new XSLTProcessor;
let XMLData;
let originalLength;
let hiddenTags = "[visibility='alternate'], [visibility='hidden']";

function renderResume(XMLData) {
    let HTMLResume = processor.transformToDocument(XMLData)
    .getElementById("resume-body");

    if(!(HTMLResume instanceof HTMLElement)) {
        throw new Error("Failed to process XML with XSLTProcessor");
    } 

    if($("#resume-placeholder").length) {
        $("#resume-placeholder").replaceWith(HTMLResume);
    }
    else if($("#resume-body").length) {
        $("#resume-body").replaceWith(HTMLResume);
    }
    else {
        throw new Error("Failed to find #resume-redirect or #resume-body");
    }
}

function handleSubmit(event) {
    event.preventDefault();
    let keywords = nlp.tokenize(($("#keywords").val())).terms().out("array");
    $("#resume-body").replaceWith("<p id='resume-placeholder'>Loading...</p>");
    setTimeout(helper, 0);
    function helper () {
        if (keywords.length > 0) {
            renderOptimalResume(keywords);
        }
        else {
            renderResume(XMLData);
        }
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

function scoreKeywords(doc, kwdsNormalized) {
    /* compiling the keywords makes lookups super fast, see:
     * https://observablehq.com/@spencermountain/compromise-match
     * We also need the keywords to be normalized.
     */
    let kwdsCompiled = nlp.compile(kwdsNormalized);

    // count the occurances of each keyword
    let counts = {};
    // let doc = nlp(docText);
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
    return result/kwdsNormalized.length;
}

function scoreLength(resumeLength, optimalLength=originalLength) {
    let x = (optimalLength - resumeLength)/optimalLength;
    return 1/(1+x**2);
}

function scoreResume(nlpDoc, normalizedKeywords) {
    let keywordScore = scoreKeywords(nlpDoc, normalizedKeywords);
    let wordCount = nlpDoc.wordCount();
    let lengthScore = scoreLength(wordCount);
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
     
    for (let i = 0; i < $activeSet.children(hiddenTags).length; i++) {
        let $resumeCopy = $resume.clone();
        let $activeSetCopy = getActiveSetCopy($resumeCopy);
        // ordering important! get current item >> hide all items >> unhide current item
        let $currentItemCopy = $activeSetCopy.find(hiddenTags).eq(i);
        $activeSetCopy.children().attr("visibility", "hidden");
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

function renderOptimalResume(keywords, resume=XMLData) {
    let $originalResume;
    if (resume instanceof XMLDocument) {
        $originalResume = $(resume).find("data").clone();
    }
    else {
        $originalResume = $(resume);
    }

    let combinations = resumeCombinations($originalResume);
    console.debug("Number of combinations: ", combinations.length);

    let kwdsNormalized = keywords.map(kw => nlp.tokenize(kw).out('normal'));
    let scores = combinations.map(x => scoreResume(nlp(extractText(x)), kwdsNormalized));

    let optimalResumeIdx = scores.indexOf(Math.max(...scores));
    let optimalResume = combinations[optimalResumeIdx].get(0);

    if (scores[optimalResumeIdx] <= scoreResume(
        nlp(extractText($originalResume)), kwdsNormalized)
        ) {
            console.debug('Original resume scores at least as good as "optimal resume"');
            optimalResume = $originalResume.get(0);
        }

    console.debug("Optimal Resume Score: ", scores[optimalResumeIdx]);
    let resumeText = extractText(optimalResume);
    console.debug("Optimal Resume Keyword Score: ", scoreKeywords(nlp(resumeText), kwdsNormalized));
    console.debug("Optimal Resume Length Score: ", scoreLength(nlp(resumeText).wordCount()));

    renderResume(optimalResume);
    return optimalResume;
}

$(document).ready(async function() { 
    await $.get("/assets/data/resume.xml", function (data){
        XMLData = data;
        originalLength = nlp.tokenize(extractText(XMLData)).wordCount();
    }).fail(function() {
        console.error("Failed to fetch XML resume")
    });
    $.get('assets/data/resume.xsl', function(data) {
        processor.importStylesheet(data);
    }).done(function() {
        renderResume(XMLData);
    }).fail(function() {
        console.error("Failed to fetch XSL stylesheet");
    });

    $("#tuning-controls").submit(handleSubmit);
});