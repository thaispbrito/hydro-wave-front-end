import { Link } from 'react-router';
import { useState } from 'react';
import styles from './CommunityPage.module.css';

const CommunityPage = (props) => {

    // Sort reports by most recent updated_at or created_at (whichever is later)
    const sortedReports = [...props.reports].sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at);
        const bDate = new Date(b.updated_at || b.created_at);
        return bDate - aDate;
    });

    const [statusFilter, setStatusFilter] = useState("All");

    const filteredReports = statusFilter === "All" ? sortedReports
        : sortedReports.filter((report) => report.status === statusFilter);

    return (
        <main className={styles.container}>
            <div className={styles.listHeader}>
                <h1>Community Reports </h1>
                <div>
                    <label htmlFor="status-filter">
                        Filter by status:
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(evt) => setStatusFilter(evt.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Unresolved">Unresolved</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Dismissed/Invalid">Dismissed/Invalid</option>
                    </select>
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
                                        ? `Posted on ${new Date(report.created_at).toLocaleDateString()} by ${report.author_username}`
                                        : `Updated on ${new Date(report.updated_at).toLocaleDateString()} by ${report.author_username}`}
                                    </p>
                                </header>
                            </article>
                        </Link>
                    ))}
                </div>

            ) : (
                <p className={styles.emptyMessage}>There are no reports yet.</p>
            )}

        </main>
    );
};

export default CommunityPage;