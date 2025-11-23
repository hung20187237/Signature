import React, { useState } from 'react';
import { Alert } from 'antd';

const AnnouncementBar = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <Alert
            message="Shipping Delay Notice: Due to high volume, orders may take 2-3 extra days to process."
            type="info"
            banner
            closable
            onClose={() => setVisible(false)}
            style={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 500
            }}
        />
    );
};

export default AnnouncementBar;
