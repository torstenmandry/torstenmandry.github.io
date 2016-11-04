---
title: "Konvertierung von Office-Dokumenten ins Open Document Format"
layout: post
date: 2012-07-13
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- openoffice
blog: true
author: torstenmandry
description:  

---

Voraussetzung

* installiertes OpenOffice (oder LibreOffice - nicht ausprobiert)
* JODConverter in der Version 3.0 (Liegt aktuell in einer Beta-Version vor und wird vom Autor nicht mehr weiterentwickelt, wurde auf github bereitgestellt)

Beispiel-Code

{% highlight java %}
import org.artofsolving.jodconverter.OfficeDocumentConverter;
import org.artofsolving.jodconverter.office.DefaultOfficeManagerConfiguration;
import org.artofsolving.jodconverter.office.OfficeManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
 
import java.io.File;
 
import static junit.framework.Assert.assertFalse;
import static junit.framework.Assert.assertTrue;
 
public class TestJodConverter {
 
    private final File docFile = new File("d:/tmp/sample.doc");
    private final File docxFile = new File("d:/tmp/sample.docx");
    private final File odtTargetFile = new File("d:/tmp/sample.odt");
 
    private final File xlsFile = new File("d:/tmp/sample.xls");
    private final File xlsxFile = new File("d:/tmp/sample.xlsx");
    private final File odsTargetFile = new File("d:/tmp/sample.ods");;
 
    private final File pptFile = new File("d:/tmp/sample.ppt");
    private final File pptxFile = new File("d:/tmp/sample.pptx");
    private final File odpTargetFile = new File("d:/tmp/sample.odp");;
 
    private OfficeManager officeManager;
    private OfficeDocumentConverter converter;
 
    @Before
    public void setUp() throws Exception {
        // Start OpenOffice Service (headless)
        officeManager = new DefaultOfficeManagerConfiguration().buildOfficeManager();
        officeManager.start();
        // Get Converter
        converter = new OfficeDocumentConverter(officeManager);
        // Remove existing target files
        removeIfExists(odtTargetFile);
        removeIfExists(odsTargetFile);
        removeIfExists(odpTargetFile);
    }
 
    private void removeIfExists(File file) {
        if (file.exists())
            file.delete();
    }
 
    @After
    public void tearDown() {
        // Shutdown OpenOffice Service
        officeManager.stop();
    }
 
    @Test
    public void testDoc2Odt() {
        assertFalse(odtTargetFile.exists());
        converter.convert(docFile, odtTargetFile);
        assertTrue(odtTargetFile.exists());
    }
 
    @Test
    public void testDocx2Odt() {
        assertFalse(odtTargetFile.exists());
        converter.convert(docxFile, odtTargetFile);
        assertTrue(odtTargetFile.exists());
    }
 
    @Test
    public void testXls2Ods() {
        assertFalse(odsTargetFile.exists());
        converter.convert(xlsFile, odsTargetFile);
        assertTrue(odsTargetFile.exists());
    }
 
    @Test
    public void testXlsx2Ods() {
        assertFalse(odsTargetFile.exists());
        converter.convert(xlsxFile, odsTargetFile);
        assertTrue(odsTargetFile.exists());
    }
 
    @Test
    public void testPpt2Odp() {
        assertFalse(odpTargetFile.exists());
        converter.convert(pptFile, odpTargetFile);
        assertTrue(odpTargetFile.exists());
    }
 
    @Test
    public void testPptx2Odp() {
        assertFalse(odpTargetFile.exists());
        converter.convert(pptxFile, odpTargetFile);
        assertTrue(odpTargetFile.exists());
    }
}
{% endhighlight %}
