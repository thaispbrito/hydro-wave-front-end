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
                                {`${report.author_username} posted on
                                ${new Date(report.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{report.observation}</p>
                    </article>
                </Link>
            ))}
        </main>
    );
};

export default ReportList;