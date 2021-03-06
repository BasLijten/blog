---
title: "Page Layout Error: 'Only Content controls are allowed directly in a content page that contains Content controls'"
date: "2009-03-10"
---

Today we were working on some pagelayouts and we got some strange error when we wanted to deploy them. After some testing, we found out that some page layouts were working, some were not. The following error message appeared:

_**Page Layout Error: 'Only Content controls are allowed directly in a content page that contains Content controls'**_

When opening the page with SharePoint Designer, we found out that the following tag was added to our page layout:

```html
<html xmlns:mso="urn:schemas-microsoft-com:office:office"xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
     <head>
         <META name="WebPartPageExpansion" content="full">
             <!--\[if gte mso 9\]><xml>
 <mso:CustomDocumentProperties>
 <mso:PublishingPreviewImage msdt:dt="string">/\_catalogs/masterpage/Preview Images/GenericPagePreview.png</mso:PublishingPreviewImage>
 <mso:ContentType msdt:dt="string">Pagina-indeling</mso:ContentType>
 <mso:MasterPageDescription msdt:dt="string">Linked with Content Type Welcome Page</mso:MasterPageDescription>
 <mso:PublishingAssociatedContentType msdt:dt="string">;#Welkomstpagina;#0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF390064DEA0F50FC8C147B0B6EA0636C4A7D4;#</mso:PublishingAssociatedContentType>
 </mso:CustomDocumentProperties>
 </xml><!\[endif\]-->
         <title>Web Parts 3 columns (PL01)</title>
     </head>
```
After we compared the working page layouts with the page layouts that didnt work, we saw that the

```aspnet
<asp:Content> </asp:Content>
```

was all lower case. After changing it back to the normal casing, everything worked correctly
