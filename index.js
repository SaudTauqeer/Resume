var url =
  "https://saudtauqeer-resume-bucket.s3.us-east-2.amazonaws.com/saud-tauqeer.pdf";

var { pdfjsLib, pdfjsViewer } = globalThis;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(
  function (pdf) {
    var viewerContainer = document.getElementById("viewerContainer");
    var viewer = document.getElementById("viewer");

    var eventBus = new pdfjsViewer.EventBus();
    var linkService = new pdfjsViewer.PDFLinkService({
      eventBus: eventBus,
    });

    linkService.externalLinkTarget = 2;

    var pdfViewer = new pdfjsViewer.PDFViewer({
      container: viewerContainer,
      viewer: viewer,
      eventBus: eventBus,
      linkService: linkService,
    });
    linkService.setViewer(pdfViewer);
    pdfViewer.setDocument(pdf);

    //pdf loaded
    document.getElementById("loader").style.display = "none";
  },
  function (reason) {
    //err
    console.error(reason);
    document.getElementById("loader").style.display = "none"; //case of error
  }
);

function downloadPDF() {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "saud-tauqeer-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

document
  .getElementById("downloadButton")
  .addEventListener("click", downloadPDF);
