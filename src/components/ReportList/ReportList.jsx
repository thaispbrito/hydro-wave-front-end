import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const ReportList = ( {reports} ) => {

    const { user } = useContext(UserContext);

    // Filter reports for the logged-in user
    const myReports = reports.filter(report => report.report_author_id === user.id);

    return (
        <main>
            <Link to='/reports/new'>Add Water Report</Link>

            {myReports.length > 0 ? (
                myReports.map((report) => (
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