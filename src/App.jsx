import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import LandingPage from './components/LandingPage/LandingPage';
import HomePage from './components/HomePage/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import * as reportService from './services/reportService';
import ReportList from './components/ReportList/ReportList';
import ReportDetails from './components/ReportDetails/ReportDetails';
import ReportForm from './components/ReportForm/ReportForm';
import CommentForm from './components/CommentForm/CommentForm';
import CommunityPage from './components/CommunityPage/CommunityPage';


const App = () => {

  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllReports = async () => {
      const reportsData = await reportService.index();

      setReports(reportsData);
    };
    if (user) fetchAllReports();
  }, [user]);

  const handleAddReport = async (reportFormData) => {
    const newReport = await reportService.create(reportFormData);
    setReports([newReport, ...reports]);
    navigate('/reports');
  };

  const handleDeleteReport = async (reportId) => {
    const deletedReport = await reportService.deleteReport(reportId);
    // Filter state using deletedHoot.id:
    setReports(reports.filter((report) => report.id !== deletedReport.id));
    navigate('/reports');
  };

  const handleUpdateReport = async (reportId, reportFormData) => {
    const updatedReport = await reportService.updateReport(reportId, reportFormData);
    setReports(reports.map((report) => (reportId === updatedReport.id ? updatedReport : report)));
    navigate(`/reports/${reportId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <LandingPage />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}
            <Route path='/reports' element={<ReportList reports={reports} />} />
            <Route path="/community" element={<CommunityPage reports={reports}/>} />
            <Route path='/reports/:reportId' element={<ReportDetails handleDeleteReport={handleDeleteReport} />} />
            <Route path='/reports/new' element={<ReportForm handleAddReport={handleAddReport} />} />
            <Route path='/reports/:reportId/edit' element={<ReportForm handleUpdateReport={handleUpdateReport} />} />
            <Route path='/reports/:reportId/comments/:commentId/edit' element={<CommentForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;