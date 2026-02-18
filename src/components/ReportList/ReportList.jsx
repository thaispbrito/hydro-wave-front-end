import { Link } from 'react-router';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import styles from './ReportList.module.css';

const ReportList = ( {reports} ) => {

    const { user } = useContext(UserContext);

    // Filter reports for the logged-in user
    const myReports = reports.filter(report => report.report_author_id === user.id);

    const [statusFilter, setStatusFilter] = useState("All");

     // Sort by most recent updated_at or created_at (whichever is later)
    const sortedReports = [...myReports].sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at);
        const bDate = new Date(b.updated_at || b.created_at);
        return bDate - aDate;
    });

    const filteredReports = statusFilter === "All" ? sortedReports
      : sortedReports.filter((report) => report.status === statusFilter);

    return (
        <main className={styles.container}>

            <div className={styles.listHeader}>
                <h1>My Reports</h1>

                <div className={styles.toolbar}>
                    <div className={styles.actionsRow}>
                        <Link to='/reports/new'>
                            <button className={styles.addButton}>Add Water Report</button>
                        </Link>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="status-filter">
                            Filter by status:
                        </label>

                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Unresolved">Unresolved</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Dismissed/Invalid">Dismissed/Invalid</option>
                        </select>
                    </div>

                </div>
            </div>

            {filteredReports.length > 0 ? (
                <div className={styles.grid}>
                    {filteredReports.map((report) => (
                        <Link key={report.id} to={`/reports/${report.id}`}>
                            <article className={styles.reportCard}>
                                <header>
                                    <h2 className={styles.reportTitle}>{report.title}</h2>
                                    <p className={styles.reportMeta}>
                                        {new Date(report.updated_at).getTime() === new Date(report.created_at).getTime()
                                            ? `Posted on ${new Date(report.created_at).toLocaleDateString()}`
                                            : `Updated on ${new Date(report.updated_at).toLocaleDateString()}`}
                                    </p>
                                </header>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className={styles.emptyMessage}>No reports found.</p>
            )}
        </main>
    );
};

export default ReportList;