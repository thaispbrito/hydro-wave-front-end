import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as reportService from '../../services/reportService';
import LocationPicker from '../LocationPicker/LocationPicker';
import styles from './ReportForm.module.css';

const ReportForm = ( { handleAddReport, handleUpdateReport } ) => {
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

    // Add a new useState for the image
    const [imageFile, setImageFile] = useState(null)

    // Add new useState to manage location picker mode
    const [isPickingLocation, setIsPickingLocation] = useState(false);

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

        // If user removed the image, send the flag
        if (formData.remove_image) {
            data.append('remove_image', 'true');
        }

        if (reportId) {
            // send the updated data to the backend
            handleUpdateReport(reportId, data);
        } else {
            // send the new data to the backend
            handleAddReport(data);
        }
    };

    // Add clear functions
    const clearLocation = () => {
        setFormData(prev => ({
            ...prev,
            location_lat: '',
            location_long: '',
            location_name: '',
        }));
    };

    const clearImage = () => {
        setImageFile(null);
        setFormData(prev => ({
            ...prev,
            image_url: '',
            remove_image: true,
        }));
        const fileInput = document.getElementById('image_url-input');
        if (fileInput) fileInput.value = '';
    };

    // Location picker mode
    if (isPickingLocation) {
        return (
            <main className={styles.container}>
                <div className={styles.mapPickerMode}>
                    <div className={styles.mapPickerHeader}>
                        <h2>📍 Pick Location</h2>
                        <p>Click on the map to select a location</p>
                    </div>

                    <div className={styles.mapContainer} style={{ height: '400px' }}>
                        <LocationPicker formData={formData} setFormData={setFormData} />
                    </div>

                    {(formData.location_lat || formData.location_name) && (
                        <div className={styles.mapPickerInfo}>
                            {formData.location_lat && formData.location_long && (
                                <p>
                                    <strong>Coordinates:</strong>{' '}
                                    {typeof formData.location_lat === 'number'
                                        ? formData.location_lat.toFixed(5)
                                        : formData.location_lat},{' '}
                                    {typeof formData.location_long === 'number'
                                        ? formData.location_long.toFixed(5)
                                        : formData.location_long}
                                </p>
                            )}
                            {formData.location_name && (
                                <p><strong>Location:</strong> {formData.location_name}</p>
                            )}
                        </div>
                    )}

                    <div className={styles.mapPickerActions}>
                        <button
                            type="button"
                            onClick={() => setIsPickingLocation(false)}
                            disabled={!formData.location_lat || !formData.location_long}
                        >
                            Confirm Location
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setIsPickingLocation(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Normal form view
    return (
        <main className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>{reportId ? 'Edit Water Report' : 'New Water Report'}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='title-input'>Title</label>
                        <input
                            required
                            type='text'
                            name='title'
                            id='title-input'
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='reported_at-input'>Date and Time</label>
                        <input
                            required
                            type='datetime-local'
                            name='reported_at'
                            id='reported_at-input'
                            value={formData.reported_at ? formatDateTimeLocal(formData.reported_at) : ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.row}>
                        <div>
                            <label htmlFor='water_source-input'>Source Type</label>
                            <select
                                required
                                name='water_source'
                                id='water_source-input'
                                value={formData.water_source}
                                onChange={handleChange}
                            >
                                <option value=''>Select an option</option>
                                <option value='Surface Water'>Surface Water</option>
                                <option value='Groundwater'>Groundwater</option>
                                <option value='Rainwater'>Rainwater</option>
                                <option value='Stormwater'>Stormwater</option>
                                <option value='Marine Water'>Marine Water</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor='water_feature-input'>Feature Type</label>
                            <select
                                required
                                name='water_feature'
                                id='water_feature-input'
                                value={formData.water_feature}
                                onChange={handleChange}
                            >
                                <option value=''>Select an option</option>
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
                        </div>
                    </div>

                    <div className={styles.locationSection}>
                        <label>Location</label>

                        {formData.location_lat && formData.location_long ? (
                            <div className={styles.locationSelected}>
                                <p className={styles.locationCoords}>
                                    📍 {typeof formData.location_lat === 'number'
                                        ? formData.location_lat.toFixed(5)
                                        : formData.location_lat},{' '}
                                    {typeof formData.location_long === 'number'
                                        ? formData.location_long.toFixed(5)
                                        : formData.location_long}
                                </p>
                                {formData.location_name && (
                                    <p className={styles.locationName}>🏙 {formData.location_name}</p>
                                )}
                                <div className={styles.locationActions}>
                                    <button
                                        type="button"
                                        className={styles.changeLink}
                                        onClick={() => setIsPickingLocation(true)}
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.clearLink}
                                        onClick={clearLocation}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className={styles.locationButton}
                                onClick={() => setIsPickingLocation(true)}
                            >
                                📍 Pick Location on Map
                            </button>
                        )}
                    </div>

                    <div>
                        <label htmlFor='observation-input'>Observation</label>
                        <textarea
                            required
                            name='observation'
                            id='observation-input'
                            value={formData.observation}
                            onChange={handleChange}
                            placeholder="Describe what you observed at this water source..."
                            rows={4}
                        />
                    </div>

                    <div className={styles.row}>
                        <div>
                            <label htmlFor='condition-input'>Condition</label>
                            <select
                                required
                                name='condition'
                                id='condition-input'
                                value={formData.condition}
                                onChange={handleChange}
                            >
                                <option value=''>Select and option</option>
                                <option value='Normal'>Normal</option>
                                <option value='Abnormal'>Abnormal</option>
                                <option value='Critical'>Critical</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor='status-input'>Status</label>
                            <select
                                required 
                                name='status'
                                id='status-input'
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value=''>Select an option</option>
                                <option value='Unresolved'>Unresolved</option>
                                <option value='Resolved'>Resolved</option>
                                <option value='Dismissed/Invalid'>Dismissed/Invalid</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fileSection}>
                        <label>Image</label>
                        {(imageFile || (reportId && formData.image_url)) ? (
                            <div className={styles.fileSelected}>
                                <p className={styles.fileName}>
                                    📎 {imageFile ? imageFile.name : formData.image_url.split('/').pop()}
                                </p>
                                <div className={styles.fileActions}>
                                    <button
                                        type="button"
                                        className={styles.changeLink}
                                        onClick={() => document.getElementById('image_url-input').click()}
                                    >
                                        Change
                                    </button>
                                    <input
                                        type='file'
                                        name='image_url'
                                        id='image_url-input'
                                        accept='image/*'
                                        className={styles.fileInput}
                                        onChange={(e) => {
                                            setImageFile(e.target.files[0]);
                                            setFormData(prev => ({
                                                ...prev,
                                                remove_image: false,
                                            }));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className={styles.clearLink}
                                        onClick={clearImage}
                                    >
                                        Remove
                                    </button>
                                </div>
                                {/* Show preview for both edit and new form */}
                                {(imageFile || formData.image_url) && (
                                    <div className={styles.currentImage}>
                                        <p>Current image:</p>
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                                            alt='Current water source'
                                        />
                                    </div>
                                )}

                            </div>
                        ) : (
                            <label className={styles.fileButton}>
                                📎 Choose Image
                                <input
                                    type='file'
                                    name='image_url'
                                    id='image_url-input'
                                    accept='image/*'
                                    className={styles.fileInput}
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />

                                {/* Show preview if imageFile is picked in new form */}
                                {imageFile && (
                                    <div className={styles.currentImage}>
                                        <p>Current image:</p>
                                        <img
                                            src={URL.createObjectURL(imageFile)}
                                            alt='Current water source'
                                        />
                                    </div>
                                )}
                            </label>
                        )}
                    </div>

                    <button type='submit' className={styles.submitButton}>
                        {reportId ? 'Update' : 'Submit'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ReportForm;