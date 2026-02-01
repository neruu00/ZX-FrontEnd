import { useEffect, useState } from 'react';

import { BookInLibraryType } from '@/services/library.api';

export default function useBookAttributes(book: BookInLibraryType) {
  const [extractedColor, setExtractedColor] = useState<string | null>(null);

  // 1. 상태(Status) 처리: 없으면 'PENDING'
  const finalStatus = book.status || 'PENDING';

  // 2. 색상(Color) 처리 로직
  useEffect(() => {
    // 이미 지정된 색상이 있다면 추출하지 않음
    if (book.spineColor) {
      setExtractedColor(book.spineColor);
      return;
    }

    // 이미지에서 색상 추출 시도 (Canvas 활용)
    const img = new Image();
    img.src = book.cover;
    img.crossOrigin = 'Anonymous'; // 중요: CORS 허용

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          // RGB -> Hex 변환
          const hex =
            '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          setExtractedColor(hex);
        }
      } catch (e) {
        // CORS 에러 등으로 캔버스 접근 불가 시, 제목 해시값으로 대체
        console.warn(
          `Cannot extract color from image (CORS likely): ${book.title}`,
        );
        setExtractedColor(stringToColor(book.title));
      }
    };

    img.onerror = () => {
      // 이미지 로드 실패 시에도 제목 해시값 사용
      setExtractedColor(stringToColor(book.title));
    };
  }, [book.cover, book.spineColor, book.title]);

  // 최종 배경색 (로딩 중이거나 계산 전이면 기본 회색)
  const bgColor = extractedColor || '#64748b';

  // 텍스트 색상 계산
  const textColor = getContrastColor(bgColor);

  return { status: finalStatus, bgColor, textColor };
}

// --- [Logic] 색상 밝기 계산 및 텍스트 색상 결정 ---
function getContrastColor(hexColor: string) {
  // 1. Hex -> RGB 변환
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // 2. 밝기(Luminance) 계산 공식
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // 3. 밝으면 검은 글씨, 어두우면 흰 글씨 (기준값 128)
  return yiq >= 128 ? '#1e293b' : '#f8fafc'; // slate-800 or slate-50
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}
