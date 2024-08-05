import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import "../../css/admin.css";
const serverUrl = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        rating: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const response = await axios.get(`${serverUrl}/admin/data`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setItems(response.data);
                } catch (error) {
                    setError('Failed to fetch data');
                    if (error.response && error.response.status === 403) {
                        localStorage.removeItem('jwtToken');
                        window.location.href = '/login';
                    }
                }
            } else {
                window.location.href = '/login';
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            rating: item.rating
        });
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('jwtToken');
        try {
            await axios.delete(`${serverUrl}/items/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.put(`${serverUrl}items/${currentItem._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItems(items.map(item => item._id === currentItem._id ? response.data : item));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating item', error);
            setError('Failed to update item');
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    const ratings = items.map(item => ({ name: item.name, rating: item.rating }));
    const commentCounts = items.map(item => ({ name: item.name, count: item.comments.length }));

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Admin Dashboard</h1>
            </div>

            {/* Example: Average Rating Line Chart */}
            <div className="chart-container">
                <h2>Items Ratings</h2>
                <LineChart width={600} height={300} data={ratings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" />
                </LineChart>
            </div>

            {/* Example: Comments Distribution Pie Chart */}
            <div className="chart-container">
                <h2>Comments Distribution</h2>
                <PieChart width={400} height={400}>
                    <Pie dataKey="count" isAnimationActive={false} data={commentCounts} cx={200} cy={200} outerRadius={80} label>
                        {commentCounts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>

            {/* Example: Data Table */}
            <div className="table-container">
                <h2>Items List</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.rating}</td>
                                <td className="table-actions">
                                    <Button variant="warning" onClick={() => handleEdit(item)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Edit Item Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleFormChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleFormChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleFormChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formRating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="rating" 
                                value={formData.rating} 
                                onChange={handleFormChange} 
                                required 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
