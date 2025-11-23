import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbItems = [
        {
            title: (
                <Link to="/">
                    <HomeOutlined />
                </Link>
            ),
        },
        ...pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = value.replace(/-/g, ' ');

            return {
                title: isLast ? (
                    <span className="capitalize font-medium">{label}</span>
                ) : (
                    <Link to={to} className="capitalize">
                        {label}
                    </Link>
                ),
            };
        }),
    ];

    return (
        <nav className="mb-6" aria-label="Breadcrumb">
            <AntBreadcrumb items={breadcrumbItems} />
        </nav>
    );
};

export default Breadcrumb;
