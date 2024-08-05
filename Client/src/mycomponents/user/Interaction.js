import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import '../../css/interaction.css';
const serverUrl = process.env.REACT_APP_API_URL;

const Interaction = ({ itemId }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${serverUrl}/items/${itemId}/comments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching comments:', err);
            }
        };

        fetchComments();
    }, [itemId]);

    const handleCommentSubmit = async () => {
        if (comment.trim()) {
            const token = localStorage.getItem('jwtToken'); // Ensure token is stored in local storage

            try {
                const response = await fetch(`${serverUrl}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include JWT token in headers
                    },
                    body: JSON.stringify({ itemId, text: comment, rating }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit comment');
                }

                const newComment = await response.json();
                setComments([...comments, newComment]);
                setComment('');
                setRating(0);
            } catch (err) {
                setError(err.message);
                console.error('Error submitting comment:', err);
            }
        }
    };

    return (
        <div className="interaction-container">
            <h2 className="section-title">Interact with Item</h2>
            <div className="rating-container">
                <h3 className="sub-title">Rate this item:</h3>
                <div className="stars">
                    {[...Array(5)].map((_, index) => (
                        <FaStar
                            key={index}
                            size={30}
                            className={index < rating ? 'star-filled' : 'star'}
                            onClick={() => setRating(index + 1)}
                        />
                    ))}
                </div>
            </div>
            <div className="comment-container">
                <h3 className="sub-title">Leave a comment:</h3>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                />
                <button className="submit-button" onClick={handleCommentSubmit}>Submit</button>
                {error && <p className="error-message">Error: {error}</p>}
            </div>
            <div className="comments-list">
                <h3 className="sub-title">Previous Comments:</h3>
                <ul>
                    {comments.map((c, index) => (
                        <li key={index} className="comment-item">
                            <p>{c.text}</p>
                            <div className="rating">
                                Rating: {[...Array(c.rating)].map((_, i) => <FaStar key={i} size={20} className="star-filled" />)}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Interaction;
