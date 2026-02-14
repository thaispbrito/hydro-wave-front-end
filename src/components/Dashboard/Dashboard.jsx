import { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../contexts/UserContext";
import * as reportService from '../../services/reportService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({
        condition: '',
        water_source: '',
    });

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

    // Apply filters for condition and water source
    const filteredReports = reports.filter(r => {
        return (
            (filters.condition ? r.condition === filters.condition : true) &&
            (filters.water_source ? r.water_source === filters.water_source : true)
        );
    });

    // Prepare chart data
    const chartData = ['Normal', 'Abnormal', 'Critical'].map(cond => ({
        condition: cond,
        count: filteredReports.filter(r => r.condition === cond).length,
    }));

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Filter reports authored by the current user
    const myReports = reports.filter(report => report.report_author_id === user.id);

    // Handler to get AI insight for a report
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
        <main>
            <h1>Dashboard</h1>

            {/* Filters */}
            <section>
            <label>
                Condition:
                <select name="condition" value={filters.condition} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
                <option value="Critical">Critical</option>
                </select>
            </label>
            <label>
                Water Source:
                <select name="water_source" value={filters.water_source} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Surface Water">Surface Water</option>
                <option value="Groundwater">Groundwater</option>
                <option value="Rainwater">Rainwater</option>
                <option value="Stormwater">Stormwater</option>
                </select>
            </label>
            </section>

            {/* Chart */}
            <section style={{ marginTop: '2rem', width: '100%', height: 300 }}>
            <h2>Reports by Condition</h2>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                <XAxis dataKey="condition" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            </section>

            {/* Table */}
            <section>
            < br />
            <h2>Reports ({filteredReports.length})</h2>
            <table border="1" cellPadding="5">
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
            </section>

            {/* My reports section to get AI suggestions */}
            <section style={{ marginTop: '2rem' }}>
                <h2>My Reports (Get AI Suggestions)</h2>
                {myReports.length === 0 && <p>You have not submitted any reports yet.</p>}
                <ul>
                    {myReports.map(r => (
                        <li key={r.id} style={{ marginBottom: '1rem' }}>
                            <strong>{r.title}</strong> ({r.condition})
                            <br />
                            <button onClick={() => handleGetInsight(r.id)}>
                                Get AI Suggestion
                            </button>
                            {aiInsights[r.id] && (
                                <p><strong>AI Suggestion:</strong> {aiInsights[r.id]}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </section>


        </main>
    );
};

export default Dashboard;