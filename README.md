# Puppeteer PDF Generation Script

This script was built to convert the Next.js docs into a pdf for ChatGPT to read.
## Prerequisites

You need to have Node.js installed on your machine to run this script. You also need to install the following npm packages:

- puppeteer
- pdf-lib

how to run:


```npm install```

//Get URLs from sitemap.xml.  
```node utils/url-fetcher.js```

//Convert HTML to PDF.  
```node index.js```
