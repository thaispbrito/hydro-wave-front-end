import { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../contexts/UserContext";
import * as reportService from '../../services/reportService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [chartWaterSource, setChartWaterSource] = useState('');
    const [tableCondition, setTableCondition] = useState('');

    // State to store AI insights by report ID
    const [aiInsights, setAiInsights] = useState({});

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchReports = async () => {
            const allReports = await reportService.index();
            setReports(allReports);
        };
        fetchReports();
    }, []);

    // Apply filter for water source
    const chartReports = chartWaterSource
        ? reports.filter(r => r.water_source === chartWaterSource)
        : reports;

    // Apply filter for condition    
    const filteredReports = tableCondition
        ? reports.filter(r => r.condition === tableCondition)
        : reports;

    // Prepare chart data
    const chartData = ['Normal', 'Abnormal', 'Critical'].map(cond => ({
        condition: cond,
        count: chartReports.filter(r => r.condition === cond).length,
    }));

    const hasChartData = chartData.some(d => d.count > 0);

    // Filter reports authored by the current user
    const myReports = reports.filter(report => report.report_author_id === user.id);

    // Handler function to get AI insight for a report
    const handleGetInsight = async (reportId) => {
        try {
            const res = await reportService.getAIInsight(reportId);
            setAiInsights(prev => ({ ...prev, [reportId]: res.insight }));
        } catch (err) {
            console.error(err);
            setAiInsights(prev => ({ ...prev, [reportId]: "Failed to get AI insight" }));
        }
    };

    return (
        <main className={styles.container}>
            <h1>Water Report Insights</h1>
            <div className={styles.card}>
                <div className={styles.dashHeader}>
                    <h2 className={styles.sectionTitle}>Number of Reports by Condition</h2>
                    <div className={styles.filtersRow}>
                        <label>
                            Water Source:
                            <select 
                                name="chartWaterSource" 
                                value={chartWaterSource} 
                                onChange={evt => setChartWaterSource(evt.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Surface Water">Surface Water</option>
                                <option value="Groundwater">Groundwater</option>
                                <option value="Rainwater">Rainwater</option>
                                <option value="Stormwater">Stormwater</option>
                                <option value="Marine Water">Marine Water</option>
                            </select>
                        </label>
                    </div>
                </div>
                {/* Chart */}
                <div className={styles.chartContainer}>
                    {hasChartData ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="condition" />
                                <YAxis allowDecimals={false} label={{ value: "Report Count", angle: -90, position: "insideLeft", offset: 20, dy: 65}}/>
                                <Tooltip />
                                <Bar dataKey="count" fill="#0077b6" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No data available to display chart.</p>
                    )}
                </div>
                {/* Table */}
                <div className={styles.tableSection}>
                    <div className={styles.dashHeader}>
                        <h2 className={styles.sectionTitle}>Community Reports ({filteredReports.length})</h2>
                        <div className={styles.filtersRow}>
                            <label>
                                Condition:
                                <select 
                                    name="tableCondition" 
                                    value={tableCondition} 
                                    onChange={evt => setTableCondition(evt.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Abnormal">Abnormal</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    {filteredReports.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Water Source</th>
                                    <th>Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.title}</td>
                                        <td>{new Date(r.reported_at).toLocaleDateString()}</td>
                                        <td>{r.water_source}</td>
                                        <td>{r.condition}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No reports available to display.</p>
                    )}
                </div>
            </div>
            {/* AI Section for user's own reports */}
            <div className={styles.aiSection}>
                <h2 className={styles.sectionTitle}>My Reports - Get AI Suggestions</h2>
                {myReports.length === 0 && <p>You have not submitted any reports yet.</p>}
                <ul className={styles.grid}>
                    {myReports.map(r => (
                        <li key={r.id}>
                            <strong>{r.title}</strong> ({r.condition})
                            <br /> 
                            <button onClick={() => handleGetInsight(r.id)}>
                                Get AI Suggestion
                            </button>
                            {aiInsights[r.id] && (
                                <p className={styles.aiSuggestion}><strong>AI Suggestion:</strong> {aiInsights[r.id]}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default Dashboard;