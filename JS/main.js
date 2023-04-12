 const url = '../docs/pdf.pdf'

 let pdfDoc = null, pageNum = 1, pageIsRendering = false, pageNumIsPending = null;

 const scale = 1.5,
 canvas = document.querySelector('#pdf-render');
 ctx = canvas.getContext('2d');

 

//Render the page
const renderPage = num =>{
    pageIsRendering = true;



    pdfDoc.getPage(num).then(page =>{
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        const renderCtx = {
            canvasContext:  ctx,
            viewport
        }

        page.render(renderCtx).promise.then(()=>{
            pageIsRendering = false;
            
            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }

        });

        //Output current page
        document.getElementById('page-num').textContent = num;
    });
};
//Check for Pages rendering
const queueRenderPage = num =>{
    if(pageIsRendering){
        pageNumIsPending = num;
    } else{
        renderPage(num);
    }
}
//Show prev page
const showPrevPage =()=>{
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}
//Show next page
const showNextPage =()=>{
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}


 //Get Document
 pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>{
  pdfDoc = pdfDoc_;
  console.log(pdfDoc); 
  document.getElementById('page-count').textContent =pdfDoc.numPages;

  renderPage(pageNum)
 });


 document.getElementById('prev-page').addEventListener('click', showPrevPage);
 document.getElementById('next-page').addEventListener('click', showNextPage);