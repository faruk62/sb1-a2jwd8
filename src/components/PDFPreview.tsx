import React from 'react';
import { Worksheet } from './Worksheet';

interface PDFPreviewProps {
  pages: Array<{
    problems: Array<{ num1: number; num2: number; operator: '+' | '-' | '×' | '÷' }>;
    pageNumber: number;
  }>;
  currentPage: number;
  onPageChange: (page: number) => void;
  settings: {
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
  };
  zoom: number;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  pages,
  currentPage,
  onPageChange,
  settings,
  zoom,
}) => {
  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-100">
      <div 
        id={`worksheet-${currentPage}`}
        className="bg-white shadow-lg mx-auto transition-transform"
        style={{
          width: settings.pageSize === 'letter' ? '8.5in' : '210mm',
          height: settings.pageSize === 'letter' ? '11in' : '297mm',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        <Worksheet 
          problems={pages[currentPage].problems}
          pageNumber={pages[currentPage].pageNumber}
          settings={settings}
        />
      </div>
    </div>
  );
};