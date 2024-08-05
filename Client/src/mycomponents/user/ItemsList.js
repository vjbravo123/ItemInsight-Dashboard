// ItemList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/ItemList.css';
const serverUrl = process.env.REACT_APP_API_URL;

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${serverUrl}/items`); // Update the URL if your server is hosted somewhere else
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setItems(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="item-list-container">
            <h1>Products</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : items.length > 0 ? (
                <div className="item-list">
                    {items.map(item => (
                        <div key={item._id} className="item">
                            <Link to={`/item/${item._id}`} className="item-link">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <p className="item-price">{item.price}</p>
                                    <div className="item-rating">
                                        {[...Array(5)].map((star, index) => (
                                            <span key={index} className={index < item.rating ? 'star-filled' : 'star'}>&#9733;</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No items available.</p>
            )}
        </div>
    );
};

export default ItemList;
