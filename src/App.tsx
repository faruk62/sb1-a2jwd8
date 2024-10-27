import React, { useState } from 'react';
import { WorksheetControls } from './components/WorksheetControls';
import { Worksheet } from './components/Worksheet';
import { Sidebar } from './components/Sidebar';
import { SettingsPanel } from './components/SettingsPanel';
import { WorksheetSettingsPanel } from './components/WorksheetSettingsPanel';
import { PDFPreview } from './components/PDFPreview';
import { ProblemCountSelector } from './components/ProblemCountSelector';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PageSettings {
  pageSize: 'letter' | 'a4';
  pageNumbering: {
    enabled: boolean;
    startFrom: number;
    centered: boolean;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  showMargins: boolean;
  pagesToDownload: 'all' | number[];
}

interface WorksheetSettings {
  grid: {
    columns: number;
    rows: number;
    itemWidth: number;
    itemHeight: number;
    rowSpacing: number;
    columnSpacing: number;
  };
  operands: {
    min: number;
    max: number;
  };
}

const defaultWorksheetSettings: WorksheetSettings = {
  grid: {
    columns: 5,
    rows: 5,
    itemWidth: 120,
    itemHeight: 100,
    rowSpacing: 16,
    columnSpacing: 16,
  },
  operands: {
    min: 1,
    max: 9,
  },
};

export default function App() {
  const [operator, setOperator] = useState<'+' | '-' | '×' | '÷'>('+');
  const [problemCount, setProblemCount] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [worksheetSettings, setWorksheetSettings] = useState<WorksheetSettings>(defaultWorksheetSettings);
  const [activePanel, setActivePanel] = useState<'none' | 'templates' | 'settings' | 'worksheet'>('none');
  const [zoom, setZoom] = useState(0.75);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    pageSize: 'letter',
    pageNumbering: {
      enabled: true,
      startFrom: 1,
      centered: true,
    },
    margins: {
      top: 0.5,
      bottom: 0.5,
      left: 0.5,
      right: 0.5,
    },
    showMargins: true,
    pagesToDownload: 'all',
  });

  function generateProblems(op: '+' | '-' | '×' | '÷', count: number) {
    const problems = [];
    const { min, max } = worksheetSettings.operands;
    
    for (let i = 0; i < count; i++) {
      let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      
      if (op === '-') {
        [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
      } else if (op === '÷') {
        num2 = Math.max(1, num2); // Prevent division by zero
        num1 = num1 * num2; // Ensure clean division
      }
      
      problems.push({ num1, num2, operator: op });
    }
    return problems;
  }

  const [pages, setPages] = useState(() => [{
    problems: generateProblems('+', 25),
    pageNumber: 1,
  }]);

  const handleOperatorChange = (newOperator: '+' | '-' | '×' | '÷') => {
    setOperator(newOperator);
    const newPages = pages.map(page => ({
      ...page,
      problems: generateProblems(newOperator, problemCount),
    }));
    setPages(newPages);
  };

  const handleProblemCountChange = (count: number) => {
    setProblemCount(count);
    const newPages = pages.map(page => ({
      ...page,
      problems: generateProblems(operator, count),
    }));
    setPages(newPages);
  };

  const handleAddPage = () => {
    setPages([...pages, {
      problems: generateProblems(operator, problemCount),
      pageNumber: pages.length + 1,
    }]);
    setCurrentPage(pages.length);
  };

  const handleGenerate = () => {
    const newPages = pages.map(page => ({
      ...page,
      problems: generateProblems(operator, problemCount),
    }));
    setPages(newPages);
  };

  const handleDownload = async () => {
    const pdf = new jsPDF({
      format: pageSettings.pageSize,
      unit: 'in',
    });

    for (let i = 0; i < pages.length; i++) {
      const worksheet = document.getElementById(`worksheet-${i}`);
      if (worksheet) {
        if (i > 0) pdf.addPage();
        
        const canvas = await html2canvas(worksheet);
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 
          pageSettings.margins.left, 
          pageSettings.margins.top, 
          pdfWidth - (pageSettings.margins.left + pageSettings.margins.right), 
          pdfHeight - (pageSettings.margins.top + pageSettings.margins.bottom)
        );
        
        if (pageSettings.pageNumbering.enabled) {
          const pageNum = (pageSettings.pageNumbering.startFrom + i).toString();
          const textWidth = pdf.getTextWidth(pageNum);
          const x = pageSettings.pageNumbering.centered 
            ? (pdfWidth - textWidth) / 2 
            : pdfWidth - pageSettings.margins.right - textWidth;
          
          pdf.text(pageNum, x, pdfHeight - pageSettings.margins.bottom + 0.3);
        }
      }
    }
    
    pdf.save('math-worksheet.pdf');
  };

  const togglePanel = (panel: 'templates' | 'settings' | 'worksheet') => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex">
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4 gap-4">
          <button
            onClick={() => togglePanel('templates')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'templates' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Templates"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          <button
            onClick={() => togglePanel('settings')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Page Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={() => togglePanel('worksheet')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'worksheet' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Worksheet Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>

        {activePanel === 'templates' && (
          <Sidebar
            onOperatorSelect={handleOperatorChange}
            currentOperator={operator}
          />
        )}

        {activePanel === 'settings' && (
          <SettingsPanel
            settings={pageSettings}
            onSettingsChange={setPageSettings}
          />
        )}

        {activePanel === 'worksheet' && (
          <WorksheetSettingsPanel
            settings={worksheetSettings}
            onSettingsChange={setWorksheetSettings}
            onUpdate={handleGenerate}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Math Worksheet Generator</h1>
            <div className="flex items-center gap-4">
              <ProblemCountSelector count={problemCount} onChange={handleProblemCountChange} />
              <button
                onClick={handleAddPage}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Page
              </button>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
                <button
                  onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="range"
                  min="25"
                  max="150"
                  value={zoom * 100}
                  onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
                  className="w-32"
                />
                <button
                  onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 ml-2">{Math.round(zoom * 100)}%</span>
              </div>
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </header>

        <PDFPreview
          pages={pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          settings={pageSettings}
          zoom={zoom}
          worksheetSettings={worksheetSettings}
        />
      </div>
    </div>
  );
}