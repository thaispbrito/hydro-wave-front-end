import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as reportService from '../../services/reportService';

const ReportForm = (props) => {
    // Destructure hootId from the useParams hook, and console log it
    const { reportId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        reported_at: '',
        water_source: '',
        water_feature: '',
        location_lat: null, 
        location_long: null,
        observation: '',
        condition: '',
        status: '',
        image_url: null,

    });

    useEffect(() => {
        const fetchReport = async () => {
            const reportData = await reportService.show(reportId);
            setFormData(reportData);
        };
        if (reportId) fetchReport();
        return () => setFormData({ title: '', reported_at: '', water_source: '', water_feature: '', location_lat: null, location_long: null, observation: '', condition: '', status: '', image_url: '' });
    }, [reportId]);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (reportId) {
            props.handleUpdateReport(reportId, formData);
        } else {
            props.handleAddReport(formData);
        }
    };

    return (
        <main>
            <h1>{reportId ? 'Edit Report' : 'New Report'}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='title-input'>Title</label>
                <input
                    required
                    type='text'
                    name='title'
                    id='title-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='created_at-input'>Date and Time</label>
                <textarea
                    required
                    type='datetime-local'
                    name='created_at'
                    id='created_at-input'
                    value={formData.created_at}
                    onChange={handleChange}
                />
                <label htmlFor='water_source-input'>Source Type</label>
                <select
                    name='water_source'
                    id='water_source-input'
                    value={formData.water_source}
                    onChange={handleChange}
                >
                    <option value='Surface Water'>Surface Water</option>
                    <option value='Groundwater'>Groundwater</option>
                    <option value='Rainwater'>Rainwater</option>
                    <option value='Stormwater'>Stormwater</option>
                </select>
                <label htmlFor='water_feature-input'>Feature Type</label>
                <select
                    name='water_feature'
                    id='water_feature-input'
                    value={formData.water_feature}
                    onChange={handleChange}
                >
                    <option value='River'>River</option>
                    <option value='Creek/Stream'>Creek/Stream</option>
                    <option value='Lake'>Lake</option>
                    <option value='Pond'>Pond</option>
                    <option value='Waterfall'>Waterfall</option>
                    <option value='Spring'>Spring</option>
                    <option value='Wetland'>Wetland</option>
                    <option value='Well'>Well</option>
                    <option value='Other'>Other</option>
                </select>

                <label htmlFor="location_lat-input">Latitude</label>
                <input
                required
                type="number"
                name="location_lat"
                id="location_lat-input"
                value={formData.location_lat || ''}
                onChange={handleChange}
                />

                <label htmlFor="location_long-input">Longitude</label>
                <input
                required
                type="number"
                name="location_long"
                id="location_long-input"
                value={formData.location_long || ''}
                onChange={handleChange}
                />

                <label htmlFor='observation-input'>Observation</label>
                <input
                    required
                    type='text'
                    name='observation'
                    id='observation-input'
                    value={formData.observation}
                    onChange={handleChange}
                    placeholder="Describe what you observed at this water source..."
                />

                <label htmlFor='condition-input'>Condition</label>
                <select
                    required
                    name='condition'
                    id='condition-input'
                    value={formData.condition}
                    onChange={handleChange}
                >
                    <option value='Normal'>Normal</option>
                    <option value='Abnormal'>Abnormal</option>
                    <option value='Critical'>Critical</option>
                </select>

                <label htmlFor='status-input'>Status</label>
                <select
                    name='status'
                    id='status-input'
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value='Unresolved'>Unresolved</option>
                    <option value='Resolved'>Resolved</option>
                    <option value='Dismissed/Invalid'>Dismissed/Invalid</option>
                </select>

                <label htmlFor='image_url-input'>Image</label>
                <input
                    type='text'
                    name='image_url'
                    id='image_url-input'
                    value={formData.image_url}
                    onChange={handleChange}
                />

                <button type='submit'>SUBMIT</button>
            </form>
        </main>
    );
};

export default ReportForm;
