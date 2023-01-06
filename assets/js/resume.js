$(document).ready(async function() { 
    let processor = new XSLTProcessor;
    const XSLstylesheet = await $.get('assets/data/resume.xsl');
    processor.importStylesheet(XSLstylesheet);
    const XMLdata = await $.get("/assets/data/resume.xml");
    HTMLresume = processor.transformToDocument(XMLdata).querySelector("#resume-body");
    if(HTMLresume) {
        $("#resume-redirect").replaceWith(HTMLresume);
    }
});