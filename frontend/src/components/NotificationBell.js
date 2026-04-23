import React, { useState, useEffect, useRef } from 'react';
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notificationApi';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await getUnreadCount();
            setUnreadCount(res.data.count);
        } catch {}
    };

    const handleOpen = async () => {
        if (!open) {
            try {
                const res = await getMyNotifications();
                setNotifications(res.data);
            } catch {}
        }
        setOpen(!open);
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch {}
    };

    const handleMarkOne = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    };

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={handleOpen}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '22px', position: 'relative', padding: '4px 8px'
                }}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '0', right: '0',
                        backgroundColor: '#e53935', color: 'white',
                        borderRadius: '50%', fontSize: '11px', fontWeight: '700',
                        width: '18px', height: '18px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', right: 0, top: '110%', width: '340px',
                    backgroundColor: 'white', borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 1000,
                    maxHeight: '400px', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                style={{ background: 'none', border: 'none', color: '#0061f2', cursor: 'pointer', fontSize: '13px' }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {notifications.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#6c757d', padding: '24px', margin: 0 }}>
                                No notifications yet
                            </p>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read && handleMarkOne(n.id)}
                                    style={{
                                        padding: '12px 16px', cursor: n.read ? 'default' : 'pointer',
                                        backgroundColor: n.read ? 'white' : '#f0f6ff',
                                        borderBottom: '1px solid #f5f5f5',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '14px', color: '#1a1a1a', marginBottom: '4px' }}>
                                        {n.message}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
