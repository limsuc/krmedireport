import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API Routes
  app.get('/api/v1/monthly-report', (req, res) => {
    const requestedMonth = req.query.month as string || '2026-05';
    
    // Mock Data Generator based on month
    const isMay = requestedMonth === '2026-05';
    
    const mockData = isMay ? [
      { id: 1, name: "인공지능 진단 소프트웨어", company: "(주)에이아이메디", grade: "2등급", date: "2026-05-10", hira: "급여", price: "25,000원", category: "진단용" },
      { id: 2, name: "개인용 혈당측정기", company: "헬스케어테크", grade: "1등급", date: "2026-05-12", hira: "비급여", price: "-", category: "체외진단" },
      { id: 3, name: "치과용 임플란트 고정체", company: "덴탈솔루션", grade: "3등급", date: "2026-05-15", hira: "급여", price: "150,000원", category: "치과용" },
      { id: 4, name: "혈관용 스텐트", company: "메디컬글로벌", grade: "4등급", date: "2026-05-20", hira: "급여", price: "1,200,000원", category: "혈관용" },
      { id: 5, name: "전동식 휠체어", company: "모빌리티코리아", grade: "2등급", date: "2026-05-22", hira: "급여", price: "3,500,000원", category: "재활용" },
      { id: 6, name: "레이저 수술기", company: "광학메디칼", grade: "3등급", date: "2026-05-24", hira: "비급여", price: "-", category: "수술용" },
      { id: 7, name: "심박수 측정용 패치", company: "바이오클라우드", grade: "2등급", date: "2026-05-26", hira: "급여", price: "45,000원", category: "진단용" },
      { id: 8, name: "자동화 복막투석 시스템", company: "네프로헬스", grade: "3등급", date: "2026-05-28", hira: "급여", price: "2,800,000원", category: "수술용" },
    ] : [
      { id: 101, name: "스마트 인슐린 펌프", company: "당뇨케어", grade: "3등급", date: "2026-04-05", hira: "급여", price: "850,000원", category: "내과용" },
      { id: 102, name: "휴대용 심전도계", company: "하트비트", grade: "2등급", date: "2026-04-12", hira: "비급여", price: "-", category: "진단용" },
      { id: 103, name: "골절 합병증 방지용 핀", company: "본테크", grade: "4등급", date: "2026-04-18", hira: "급여", price: "450,000원", category: "정형외과용" },
    ];
    
    res.json({
      status: 'success',
      data: mockData,
      summary: isMay ? {
        total: 124,
        topCategory: "AI 진단",
        highRisk: 12,
        insuranceRate: 68
      } : {
        total: 89,
        topCategory: "정형외과",
        highRisk: 5,
        insuranceRate: 52
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  }

  return app;
}

export default startServer();
