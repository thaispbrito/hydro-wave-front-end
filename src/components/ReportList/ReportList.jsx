import { Link } from 'react-router';

const ReportList = (props) => {
    return (
        <main>
            {props.reports.map((report) => (
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
            ))}
        </main>
    );
};

export default ReportList;