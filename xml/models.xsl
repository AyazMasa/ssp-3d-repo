<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>3D Models Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 16px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #999; padding: 8px; text-align: left; }
          th { background: #eee; }
          .meta { margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <h1>3D Models Report</h1>

        <div class="meta">
          <p><b>Total:</b> <xsl:value-of select="count(/models/model)"/></p>
          <p><b>Generated:</b> <xsl:value-of select="/models/@generatedAt"/></p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Model ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Email</th>
              <th>Category</th>
              <th>Format</th>
              <th>Status</th>
              <th>Created</th>
              <th>File Link</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="/models/model">
              <tr>
                <td><xsl:value-of select="model_id"/></td>
                <td><xsl:value-of select="title"/></td>
                <td><xsl:value-of select="author_name"/></td>
                <td><xsl:value-of select="author_email"/></td>
                <td><xsl:value-of select="category"/></td>
                <td><xsl:value-of select="format"/></td>
                <td><xsl:value-of select="visibility_status"/></td>
                <td><xsl:value-of select="created_at"/></td>
                <td>
                  <a href="{file_link}" target="_blank">
                    <xsl:value-of select="file_link"/>
                  </a>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>

        <p style="margin-top:12px;">
          <a href="/models">Back to Models</a>
        </p>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
