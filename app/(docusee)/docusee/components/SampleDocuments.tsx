// components/SampleDocuments.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './SampleDocuments.module.css';

interface Document {
  id: number;
  name: string;
  thumbnail: string;
}

const sampleDocs: Document[] = [
  { id: 1, name: '자동차 사고 보상 신청.pdf', thumbnail: '/docudata/doc1.png' },
  { id: 2, name: 'Educational meeting agenda.docx', thumbnail: '/docudata/doc2.png' },
  { id: 3, name: 'Bold project timeline.pptx', thumbnail: '/docudata/doc3.png' },
  { id: 4, name: 'Travel expense report.xlsx', thumbnail: '/docudata/doc4.png' },
  { id: 5, name: '보도자료.hwp', thumbnail: '/docudata/doc5.png' },
];

const SampleDocuments: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedDoc((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>샘플 문서 선택</h2>
      <div className={styles.thumbnailGrid}>
        {sampleDocs.map((doc) => {
          const isSelected = selectedDoc === doc.id;
          return (
            <div
              key={doc.id}
              className={`${styles.thumbnailItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleSelect(doc.id)}
            >
              <div className={styles.thumbnail}>
                <Image
                  src={doc.thumbnail}
                  alt={doc.name}
                  width={120} // 최대 가로 크기
                  height={160} // 최대 세로 크기
                  className={styles.thumbnailImage}
                  style={{ objectFit: 'contain' }} // 비율 유지
                />
                {isSelected && <div className={styles.checkOverlay}>✔</div>}
              </div>
              <p className={styles.docName}>{doc.name}</p>
            </div>
          );
        })}
      </div>
      {selectedDoc !== null && (
        <div className={styles.selectedInfo}>
          <p>선택된 문서: {sampleDocs.find((doc) => doc.id === selectedDoc)?.name}</p>
        </div>
      )}
    </div>
  );
};

export default SampleDocuments;