import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as reportService from '../../services/reportService';

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
            // // Find comment in fetched report data
            // setFormData(reportData.comments.find((comment) => String(comment.comment_id) === commentId));
        };
        if (reportId && commentId) fetchReport();
    }, [reportId, commentId]);


    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    // const handleSubmit = (evt) => {
    //     evt.preventDefault();
    //     if (reportId && commentId) {
    //         reportService.updateComment(reportId, commentId, formData);
    //         navigate(`/reports/${reportId}`);
    //     } else {
    //         props.handleAddComment(formData);
    //     }
    //     setFormData({ text: '' });
    // };

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

        // Clear form (optional if navigating away)
        setFormData({ text: '' });
    };


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='text-input'>Your comment:</label>
            <textarea
                required
                type='text'
                name='text'
                id='text-input'
                value={formData.text}
                onChange={handleChange}
            />
            <button type='submit'>SUBMIT COMMENT</button>
        </form>
    );
};

export default CommentForm;

