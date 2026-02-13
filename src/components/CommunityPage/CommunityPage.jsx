import { Link } from 'react-router';

const CommunityPage = (props) => {
    return (
        <main>
            <h1>Community Reports </h1>
            {props.reports.map((report) => (
                <Link key={report.id} to={`/reports/${report.id}`}>
                    <article>
                        <header>
                            <h2>{report.title}</h2>
                            <p>
                            {new Date(report.updated_at).getTime() === new Date(report.created_at).getTime()
                                ? `Posted on ${new Date(report.created_at).toLocaleDateString()} by ${report.author_username}`
                                : `Updated on ${new Date(report.updated_at).toLocaleDateString()} by ${report.author_username}`}
                            </p>
                        </header>
                    </article>
                </Link>
            ))}

        </main>
    );
};

export default CommunityPage;