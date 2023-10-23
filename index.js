const bucket = `https://saudtauqeer-resume-bucket.s3.us-east-2.amazonaws.com`;
const key = `/resume.pdf`;
const s3Url = bucket + key;

const { pdfjsLib, pdfjsViewer } = globalThis;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const loadingTask = pdfjsLib.getDocument(s3Url);
loadingTask.promise.then(
  function (pdf) {
    const viewerContainer = document.getElementById("viewerContainer");
    const viewer = document.getElementById("viewer");

    const eventBus = new pdfjsViewer.EventBus();
    const linkService = new pdfjsViewer.PDFLinkService({
      eventBus: eventBus,
    });

    linkService.externalLinkTarget = 2;

    const pdfViewer = new pdfjsViewer.PDFViewer({
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
  fetch(s3Url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
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
