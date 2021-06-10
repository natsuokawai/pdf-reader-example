import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer() {
  const [file, setFile] = useState(null);
  const [random, setRandom] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);

  function onFileChange(event) {
    setCurrentPage(0);
    setFile(event.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    setPages([...Array(nextNumPages).keys()]);
  }

  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentPage(c => c + 1);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (random) {
      setPages(shuffle(pages));
    } else {
      setPages([...Array(numPages).keys()]);
    }
  }, [random]);

  return (
    <div>
      <div>
        <label htmlFor="file" />
        <input onChange={onFileChange} type="file" />
      </div>
      { file ? 
        <div>
          <button onClick={start}> start </button>
          <button onClick={stop}> stop </button>
          <button onClick={() => setCurrentPage(0)}> reset </button>{' '}
          <button onClick={() => setCurrentPage(currentPage - 1)}> ← </button>
          <button onClick={() => setCurrentPage(currentPage + 1)}> → </button>{' '}
          <button onClick={() => setRandom(!random)}> { random ? 'random' : 'normal' } </button>
        </div> : null
      }
      <div>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              key={`page_${pages[currentPage + 1]}`}
              pageNumber={pages[currentPage + 1]}
            />
        </Document>
      </div>
    </div>
  );
}
