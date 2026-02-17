import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const ReportList = ( {reports} ) => {

    const { user } = useContext(UserContext);

    // Filter reports for the logged-in user
    const myReports = reports.filter(report => report.report_author_id === user.id);

     // Sort by most recent updated_at or created_at (whichever is later)
    const sortedReports = [...myReports].sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at);
        const bDate = new Date(b.updated_at || b.created_at);
        return bDate - aDate;
    });

    return (
        <main>
            <Link to='/reports/new'>Add Water Report</Link>

            {sortedReports.length > 0 ? (
                sortedReports.map((report) => (
                    <Link key={report.id} to={`/reports/${report.id}`}>
                        <article>
                            <header>
                                <h2>{report.title}</h2>
                                <p>
                                    {new Date(report.updated_at).getTime() === new Date(report.created_at).getTime()
                                        ? `Posted on ${new Date(report.created_at).toLocaleDateString()}`
                                        : `Updated on ${new Date(report.updated_at).toLocaleDateString()}`}
                                </p>
                            </header>
                        </article>
                    </Link>
                ))
            ) : (
                <p>You haven't submitted any reports yet.</p>
            )}
        </main>
    );
};

export default ReportList;