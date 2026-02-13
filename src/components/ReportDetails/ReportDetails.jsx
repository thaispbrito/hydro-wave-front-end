import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as reportService from '../../services/reportService';
import CommentForm from '../CommentForm/CommentForm';
import LocationViewer from '../LocationViewer/LocationViewer';

const ReportDetails = (props) => {

    const { reportId } = useParams();
    const { user } = useContext(UserContext);
    const [report, setReport] = useState(null);
    const [showMap, setShowMap] = useState(false);


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

    const handleDeleteComment = async (commentId) => {
        await reportService.deleteComment(reportId, commentId)
        setReport({...report, comments: report.comments.filter((comment) => comment.comment_id !== commentId), });
    };

    if (!report) return <main>Loading...</main>;

    return (
        <main>
            <section>
                <header>
                    <h1>{report.title}</h1>
                    <p>
                        {`${report.author_username} posted on
                        ${new Date(report.created_at).toLocaleDateString()}`}
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
                <p>Location: 🏙 {report.location_name} (📍 {report.location_lat}, {report.location_long})</p>

                <button
                    type="button"
                    onClick={() => setShowMap(prev => !prev)}
                    style={{ marginBottom: '1rem' }}
                    >
                        
                    {showMap ? 'Hide Map' : 'Open Map'}
                </button>

                {showMap && (
                    <LocationViewer
                        lat={report.location_lat}
                        lng={report.location_long}
                        locationName={report.location_name}
                        height="400px"
                        zoom={15}
                    />
                )}
        
                {/* Option to open directly in OpenStreetMap */}
                <a
                    href={`https://www.openstreetmap.org/?mlat=${report.location_lat}&mlon=${report.location_long}#map=15/${report.location_lat}/${report.location_long}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open in OpenStreetMap
                </a>

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
                    <article key={comment.comment_id}>
                        <header>
                            <p>
                                {`${comment.comment_author_username}: ${comment.comment_text}`}
                            </p>
                            <p>
                                {`Posted on ${new Date(comment.comment_created_at).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{comment.text}</p>


                        {/* This block needs to be adjusted: */}
                        {comment.comment_author_username === user.username && (
                            <>
                                <Link to={`/reports/${reportId}/comments/${comment.comment_id}/edit`}>Edit</Link>
                                
                                <button onClick={() => handleDeleteComment(comment.comment_id)}>
                                    Delete
                                </button>
                            </>
                        )}

                    </article>
                ))}
            </section>
        </main>
    );
};

export default ReportDetails;