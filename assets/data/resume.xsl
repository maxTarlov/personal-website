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
<xsl:template match="data">
    <div class="title"> <!-- Maybe a header? -->
        <h1><xsl:value-of select="contact/name"/></h1>
        <a href="{contact/url/@href}"><xsl:value-of select="contact/url"/></a>
    </div>
    <xsl:for-each select="section">
        <ul class="section section-{@type}">
            <xsl:apply-templates/>
        </ul>
    </xsl:for-each>
</xsl:template>
<xsl:template match="header">
    <h2><xsl:apply-templates/></h2>
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
</xsl:stylesheet>