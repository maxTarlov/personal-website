<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <html>
    <head>
        <link rel="stylesheet" href="/assets/css/style.css?v="/>
        <link rel="stylesheet" href="/assets/css/resume.css"/>
    </head>
    <body>
        <div id="resume-body">
            <xsl:apply-templates/>
        </div>
    </body>
    </html>
</xsl:template>
<xsl:template match="data/contact">
    <div class="title"> <!-- Maybe a header? -->
        <h1><xsl:value-of select="name"/></h1>
        <p>
            <xsl:value-of select="location"/>
            <br/>
            <a href="{url/@href}"><xsl:value-of select="url"/></a>
        </p>
    </div>
</xsl:template>
<xsl:template match="data/section">
    <div class="section section-{@type}">
        <xsl:apply-templates/>
    </div>
</xsl:template>
<xsl:template match="header">
    <h2><xsl:apply-templates/></h2>
</xsl:template>
<xsl:template match="details">
    <ul class="details">
        <xsl:apply-templates/>
    </ul>
</xsl:template>
<xsl:template match="details[@display='inline']">
    <div class="inline-details">
        <xsl:apply-templates/>
    </div>
    <p></p>
</xsl:template>
<xsl:template match="item">
    <li>
        <xsl:apply-templates/>
    </li>
</xsl:template>
<xsl:template match="experience">
    <strong><xsl:value-of select="company|school"/></strong> &#8212; <i><xsl:value-of select="job-title|degree"/></i>
    <br/>
    <xsl:apply-templates select="dates"/>
    <xsl:apply-templates select="details|list"/>
</xsl:template>
<xsl:template match="dates">
    <div class="dates">
        <small><xsl:value-of select="start"/> &#8211; <xsl:value-of select="end"/></small>
    </div>
</xsl:template>
<xsl:template match="alt">
    <!-- Intentionally blank -->
</xsl:template>
<!-- <xsl:template>
</xsl:template> -->
</xsl:stylesheet>