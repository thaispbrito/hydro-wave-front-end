import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as reportService from '../../services/reportService';
import styles from './CommentForm.module.css';

const CommentForm = (props) => {
    const [formData, setFormData] = useState({ text: '' });

    const { reportId, commentId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchReport = async () => {
            const reportData = await reportService.show(reportId);
            // Find comment in fetched report data
            const foundComment = reportData.comments.find(
                (comment) => String(comment.comment_id) === commentId
            );
            if (foundComment) {
                setFormData({ text: foundComment.comment_text });
            }
        };
        if (reportId && commentId) fetchReport();
    }, [reportId, commentId]);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (reportId && commentId) {
            // Include updated_at timestamp so backend can process it
            const updatedComment = {
                ...formData,
                updated_at: new Date().toISOString(),
            };

            // Await the backend update
            await reportService.updateComment(reportId, commentId, updatedComment);

            // Navigate back to the report details (or refresh state)
            navigate(`/reports/${reportId}`);
        } else {
            props.handleAddComment(formData);
        }

        // Clear form 
        setFormData({ text: '' });
    };

    const handleCancel = (evt) => {
        evt.preventDefault();
        if (reportId) {
            navigate(`/reports/${reportId}`);
        }
    };

    return commentId ? (
        <section className={styles.commentSection}>
            <form onSubmit={handleSubmit}>
                <label htmlFor='text-input'><strong>Update comment:</strong></label>
                <textarea
                    required
                    name='text'
                    id='text-input'
                    value={formData.text}
                    onChange={handleChange}
                />
                <div className={styles.buttonGroup}>
                    <button type='submit' className={styles.submitButton}>
                        Submit
                    </button>
                    <button
                        type='button'
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    ) : (
        <form onSubmit={handleSubmit}>
            <label htmlFor='text-input'><strong>Your comment:</strong></label>
            <textarea
                required
                name='text'
                id='text-input'
                value={formData.text}
                onChange={handleChange}
            />
            <button type='submit' className={styles.submitButton}>
                Submit
            </button>
        </form>
    );
};

export default CommentForm;

