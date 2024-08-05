import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../css/ItemDetail.css';
import Interaction from './Interaction';
const serverUrl = process.env.REACT_APP_API_URL;

const ItemDetail = () => {
    const { itemId } = useParams(); // Get itemId from URL parameters
    const [item, setItem] = useState(null); // State to hold the item data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Fetch item details from the server
        const fetchItem = async () => {
            try {
                const response = await fetch(`${serverUrl}/items/${itemId}`);
                if (!response.ok) {
                    throw new Error('Item not found');
                }
                const data = await response.json();
                setItem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!item) {
        return <p>Item not found.</p>;
    }

    return (
        <div className="item-detail-container">
            <div className="item-detail-header">
                <Link to="/items" className="back-link">Back to Items</Link>
                <h1>{item.name}</h1>
            </div>
            <div className="item-detail-content">
                <div className="item-detail-image">
                    <img src={item.image} alt={item.name} />
                </div>
                <div className="item-detail-info">
                    <p className="item-detail-description">{item.description}</p>
                    <p className="item-detail-details">{item.details}</p>
                    <p className="item-detail-price">{item.price}</p>
                    <div className="item-detail-rating">
                        {[...Array(5)].map((star, index) => (
                            <span key={index} className={index < item.rating ? 'star-filled' : 'star'}>&#9733;</span>
                        ))}
                    </div>
                </div>
            </div>
            <Interaction itemId={itemId} />
        </div>
    );
};

export default ItemDetail;
