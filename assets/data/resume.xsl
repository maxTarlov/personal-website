<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <html>
    <head>
        <link rel="stylesheet" href="/assets/css/resume.css"/>
    </head>
    <body>
        <xsl:apply-templates/>
    </body>
    </html>
</xsl:template>
<xsl:template match="data/contact">
    <div class="title"> <!-- Maybe a header? -->
        <h1><xsl:value-of select="name"/></h1>
        <a href="{url/@href}"><xsl:value-of select="url"/></a>
    </div>
</xsl:template>
<xsl:template match="data/section">
    <div class="section section-{@type}">
        <h2><xsl:value-of select="header"/></h2>
        <ul>
            <xsl:apply-templates select="item"/>
        </ul>
    </div>
</xsl:template>
<xsl:template match="item">
    <li class="item item-{../@type}">
        <xsl:apply-templates/>
    </li>
</xsl:template>
<xsl:template match="item/alt">
    <li style="display: none;">
        <xsl:apply-templates/>
    </li>
</xsl:template>
<xsl:template match="details">
    <ul class="details">
        <xsl:apply-templates/>
    </ul>
</xsl:template>
<!-- <xsl:template>
</xsl:template> -->
</xsl:stylesheet>