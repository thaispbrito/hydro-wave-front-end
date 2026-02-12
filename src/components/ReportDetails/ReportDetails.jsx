import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as reportService from '../../services/reportService';
import CommentForm from '../CommentForm/CommentForm';

const ReportDetails = (props) => {

    const { reportId } = useParams();
    const { user } = useContext(UserContext);
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            const reportData = await reportService.show(reportId);
            setReport(reportData);
        };
        fetchReport();
    }, [reportId]);

    const handleAddComment = async (commentFormData) => {
        const newComment = await reportService.createComment(reportId, commentFormData);
        setReport({ ...report, comments: [...report.comments, newComment] });
    };

    if (!report) return <main>Loading...</main>;

    return (
        <main>
            <section>
                <header>
                    <h1>{report.title}</h1>
                    <p>
                        {`${report.author_username} posted on
                        ${new Date(report.createdAt).toLocaleDateString()}`}
                    </p>
                    {report.report_author_id === user.id && (
                        <>
                            <Link to={`/reports/${reportId}/edit`}>Edit</Link>
                            
                            <button onClick={() => props.handleDeleteReport(reportId)}>
                                Delete
                            </button>
                        </>
                    )}
                </header>
                <p>Date and Time: {report.reported_at}</p>
                <p>Source Type: {report.water_source}</p>
                <p>Feature Type: {report.water_feature}</p>
                <p>Location: Latitude - {report.location_lat} | Longitude - {report.location_long}</p>
                <p>Observation: {report.observation}</p>
                <p>Condition: {report.condition}</p>
                <p>Status: {report.status}</p>
                <img src={report.image_url} width={300} alt={report.title} />

            </section>
            <section>
                <h2>Comments</h2>
                <CommentForm handleAddComment={handleAddComment} />

                {!report.comments.length && <p>There are no comments.</p>}

                {report.comments.map((comment) => (
                    <article key={comment.id}>
                        <header>
                            <p>
                                {`${comment.comment_author_username} posted on
                                ${new Date(comment.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{comment.text}</p>
                    </article>
                ))}
            </section>
        </main>
    );
};

export default ReportDetails;
