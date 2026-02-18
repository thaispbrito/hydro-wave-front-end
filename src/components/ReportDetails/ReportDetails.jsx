import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as reportService from '../../services/reportService';
import CommentForm from '../CommentForm/CommentForm';
import LocationViewer from '../LocationViewer/LocationViewer';
import styles from './ReportDetails.module.css';

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

 // Map view mode
    if (showMap) {
        return (
            <main className={styles.container}>
                <div className={styles.mapPickerMode}>
                    <div className={styles.mapPickerHeader}>
                        <h2>📍 Location Map</h2>
                        <p>Viewing the location for this report</p>
                    </div>
                    <div className={styles.mapContainer} style={{ height: '400px' }}>
                        <LocationViewer
                            lat={report.location_lat}
                            lng={report.location_long}
                            locationName={report.location_name}
                            height="400px"
                            zoom={15}
                            draggable={true}
                            scrollWheelZoom={true}
                            zoomControl={true}
                        />
                    </div>

                    {/* Location info under the map*/}
                    {(report.location_lat || report.location_name) && (
                        <div className={styles.mapPickerInfo}>
                            {report.location_lat && report.location_long && (
                                <p>
                                    <strong>Coordinates:</strong>{' '}
                                    {typeof report.location_lat === 'number'
                                        ? report.location_lat.toFixed(5)
                                        : report.location_lat},{' '}
                                    {typeof report.location_long === 'number'
                                        ? report.location_long.toFixed(5)
                                        : report.location_long}
                                </p>
                            )}
                            {report.location_name && (
                                <p><strong>Location:</strong> {report.location_name}</p>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${report.location_lat}&mlon=${report.location_long}#map=15/${report.location_lat}/${report.location_long}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}
                        >
                            Open in OpenStreetMap
                        </a>
                    </div>
                    <div className={styles.mapPickerActions}>
                        <button
                            type="button"
                            onClick={() => setShowMap(false)}
                        >
                            Close Map
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Normal details view
    return (
        <main className={styles.container}>
            <section className={styles.reportCard}>
                <header>
                    <h1 className={styles.title}>{report.title}</h1>
                    <p className={styles.meta}>
                        {new Date(report.updated_at).getTime() === new Date(report.created_at).getTime()
                            ? `Posted on ${new Date(report.created_at).toLocaleDateString()} by ${report.author_username}`
                            : `Updated on ${new Date(report.updated_at).toLocaleDateString()} by ${report.author_username}`}
                    </p>
                </header>
                <div className={styles.detailsList}>
                    <p><strong>Date and Time:</strong> {report.reported_at}</p>                 
                    <p><strong>Source Type:</strong> {report.water_source}</p>
                    <p><strong>Feature Type:</strong> {report.water_feature}</p>                   
                    <p>
                        <strong>Location:</strong> 🏙 {report.location_name} (📍 {report.location_lat}, {report.location_long}){' '}
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                setShowMap(true);
                            }}
                            style={{ color: 'var(--primary-blue)', textDecoration: 'underline', marginLeft: 8 }}
                        >
                            Open Map
                        </a>
                    </p>
                </div>
                <div className={styles.detailsList}>
                    <p><strong>Observation:</strong> {report.observation}</p>                   
                    <p><strong>Condition:</strong> {report.condition}</p>
                    <p><strong>Status:</strong> {report.status}</p>            
                </div>
                {report.image_url && (
                    <div className={styles.imagePreview}>
                        <img src={report.image_url} alt={report.title} />
                    </div>
                )}

                {report.report_author_id === user.id && (
                    <div className={styles.buttonGroup}>
                        <Link to={`/reports/${reportId}/edit`}>
                            <button type="button" className={styles.editButton}>Edit</button>
                        </Link>
                        <button className={styles.deleteButton} onClick={() => props.handleDeleteReport(reportId)}>
                            Delete
                        </button>
                    </div>
                )}
            </section>
            <section className={styles.commentsSection}>
                <h2 className={styles.commentsTitle}>Comments</h2>
                <CommentForm handleAddComment={handleAddComment} />
                               
                {!report.comments.length && <p className={styles.commentMsg}>There are no comments yet.</p>}
                {report.comments.map((comment) => (
                    <article key={comment.comment_id} className={styles.commentCard}>
                        <header>
                            <div className={styles.commentHeader}>
                                {comment.comment_author_username}
                            </div>
                            <div className={styles.commentMeta}>
                                {new Date(comment.comment_updated_at).getTime() === new Date(comment.comment_created_at).getTime()
                                    ? `Posted on ${new Date(comment.comment_created_at).toLocaleDateString()}`
                                    : `Updated on ${new Date(comment.comment_updated_at).toLocaleDateString()}`}
                            </div>
                        </header>
                        <p>{comment.comment_text}</p>
                       
                        {user && (
                            <div className={styles.commentActions}>
                                {comment.comment_author_username === user.username && (
                                    <Link to={`/reports/${reportId}/comments/${comment.comment_id}/edit`} >
                                        <button type="button" className={styles.editButton}>Edit</button>
                                    </Link>
                                )}
                                {(comment.comment_author_username === user.username ||
                                    report.report_author_id === user.id) && (
                                    <button className={styles.deleteButton} onClick={() => handleDeleteComment(comment.comment_id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
};

export default ReportDetails;