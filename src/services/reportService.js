const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/reports`;

// Read all reports
const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Read a single report
const show = async (reportId) => {
    try {
        const res = await fetch(`${BASE_URL}/${reportId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Create a report
const create = async (reportFormData) => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: reportFormData,
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Create a comment for a report
const createComment = async (reportId, commentFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/${reportId}/comments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Delete a report
const deleteReport = async (reportId) => {
    try {
        const res = await fetch(`${BASE_URL}/${reportId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Delete a comment
const deleteComment = async (reportId, commentId) => {
    try {
        const res = await fetch(`${BASE_URL}/${reportId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Update a report
const updateReport = async (reportId, reportFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/${reportId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: reportFormData,
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

// Update a comment
const updateComment = async (reportId, commentId, commentFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/${reportId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export {
    index,
    show,
    create,
    createComment,
    deleteReport,
    deleteComment,
    updateReport,
    updateComment,
};