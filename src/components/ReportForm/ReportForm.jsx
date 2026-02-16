import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as reportService from '../../services/reportService';
import LocationPicker from '../LocationPicker/LocationPicker';

const ReportForm = ( { handleAddReport, handleUpdateReport } ) => {
    // Destructure hootId from the useParams hook, and console log it
    const { reportId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        reported_at: '',
        water_source: '',
        water_feature: '',
        location_lat: '', 
        location_long: '',
        location_name: '',
        observation: '',
        condition: '',
        status: '',
    });

    // Add a new useState for your image
    const [imageFile, setImageFile] = useState(null)

    const [showMap, setShowMap] = useState(false);

    // Helper function
    const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchReport = async () => {
            if (!reportId) return
            const reportData = await reportService.show(reportId)
            setFormData({
                title: reportData.title || '',
                reported_at: reportData.reported_at || '',
                water_source: reportData.water_source || '',
                water_feature: reportData.water_feature || '',
                location_lat: reportData.location_lat || '',
                location_long: reportData.location_long || '',
                location_name: reportData.location_name || '',
                observation: reportData.observation || '',
                condition: reportData.condition || '',
                status: reportData.status || '',
                // add image_url to the formData
                // we want to see if a report already has an image when we go to edit the report
                image_url: reportData.image_url || '',
            })
        }
        fetchReport()
    }, [reportId])


    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();


        // FormData allows us to send text and files to our backend
        const data = new FormData()

        // append (add) the form values to FormData
        data.append('title', formData.title)
        data.append('reported_at', formData.reported_at)
        data.append('water_source', formData.water_source)
        data.append('water_feature', formData.water_feature)
        data.append('location_lat', formData.location_lat)
        data.append('location_long', formData.location_long)
        data.append('location_name', formData.location_name)
        data.append('observation', formData.observation)
        data.append('condition', formData.condition)
        data.append('status', formData.status)

        if (imageFile) {
            data.append('image_url', imageFile)
        }

        if (reportId) {
            // send the updated data to the backend
            handleUpdateReport(reportId, data);
        } else {
            // send the new data to the backend
            handleAddReport(data);
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
                <label htmlFor='reported_at-input'>Date and Time</label>
                <input
                    required
                    type='datetime-local'
                    name='reported_at'
                    id='reported_at-input'
                    value={formData.reported_at ? formatDateTimeLocal(formData.reported_at) : ''}
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
                    <option value='Marine Water'>Marine Water</option>
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
                    <option value='Ocean'>Ocean</option>
                    <option value='Coastal Area'>Coastal Area</option>
                    <option value='Bay'>Bay</option>
                    <option value='Harbor'>Harbor</option>
                    <option value='Lagoon'>Lagoon</option>
                    <option value='Estuary'>Estuary</option>
                    <option value='Other'>Other</option>
                </select>

                {/* <label>Pick Location</label>
                <LocationPicker formData={formData} setFormData={setFormData} /> */}

                <label>Location</label>

                <button
                    type="button"
                    onClick={() => setShowMap(prev => !prev)}
                    style={{ marginBottom: '1rem' }}
                >
                    {showMap ? 'Hide Map' : 'Pick Location on Map'}
                </button>

                {formData.location_lat && formData.location_long && (
                    <p>
                        📍 {formData.location_lat.toFixed(5)}, {formData.location_long.toFixed(5)}
                    </p>
                )}

                {showMap && (
                    <LocationPicker formData={formData} setFormData={setFormData} />
                )}

                {/* Show selected coordinates
                {formData.location_lat && formData.location_long && (
                <p>
                    Selected: {formData.location_lat.toFixed(5)}, {formData.location_long.toFixed(5)}
                </p>
                )} */}

                {formData.location_name && (
                <p>
                    🏙 {formData.location_name}
                </p>
                )}


                <label htmlFor='observation-input'>Observation</label>
                <textarea
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

                {/* add a new label and input for the image */}
                <label htmlFor='image_url-input'>Image</label>
                <input
                    type='file'
                    name='image_url'
                    id='image_url-input'
                    accept='image/*'
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                {/* if the report is being updated, show a preview of the previously uploaded image */}
                {reportId && formData.image_url && (
                    <div>
                        <p>Current image:</p>
                        <img
                            src={formData.image_url}
                            alt='Current water source picture'
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                )}

                <button type='submit'>SUBMIT</button>
            </form>
        </main>
    );
};

export default ReportForm;
