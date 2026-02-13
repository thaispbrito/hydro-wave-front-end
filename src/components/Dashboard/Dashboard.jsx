import { useState, useEffect } from 'react';
import * as reportService from '../../services/reportService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({
        condition: '',
        water_source: '',
    });

    useEffect(() => {
        const fetchReports = async () => {
            const allReports = await reportService.index();
            setReports(allReports);
        };
        fetchReports();
    }, []);

    // Apply filters
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
        </main>
    );
};

export default Dashboard;


