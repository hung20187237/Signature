import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, InputNumber, Button, Divider, Empty, Typography } from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const { Text, Title } = Typography;

const CartDrawer = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        isCartOpen,
        closeCart
    } = useCart();
    const { formatCurrency } = useSettings();

    return (
        <Drawer
            title={<Title level={4} style={{ margin: 0 }}>Your cart</Title>}
            placement="right"
            onClose={closeCart}
            open={isCartOpen}
            width={384}
            footer={
                cartItems.length > 0 && (
                    <div className="space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <Text strong style={{ fontSize: 18 }}>Subtotal:</Text>
                            <Text strong style={{ fontSize: 18 }}>{formatCurrency(getCartTotal())}</Text>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Link to="/cart" onClick={closeCart} className="block">
                                <Button
                                    block
                                    size="large"
                                    style={{ backgroundColor: '#111827', color: 'white', fontWeight: 500 }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1f2937'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#111827'}
                                >
                                    View cart
                                </Button>
                            </Link>
                            <Link to="/checkout" onClick={closeCart} className="block">
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    style={{ fontWeight: 500 }}
                                >
                                    Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                )
            }
        >
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Empty
                        image={<ShoppingOutlined style={{ fontSize: 64, color: '#d1d5db' }} />}
                        description={
                            <Text type="secondary" style={{ fontSize: 18 }}>
                                Your cart is empty
                            </Text>
                        }
                    >
                        <Link to="/shop" onClick={closeCart}>
                            <Button type="primary" size="large">
                                Start shopping
                            </Button>
                        </Link>
                    </Empty>
                </div>
            ) : (
                <List
                    dataSource={cartItems}
                    renderItem={(item) => (
                        <List.Item
                            key={item.cartItemId}
                            style={{ alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid #e5e7eb' }}
                        >
                            <div className="flex gap-4 w-full">
                                {/* Product Image */}
                                <Link
                                    to={`/product/${item._id}`}
                                    onClick={closeCart}
                                    className="flex-shrink-0"
                                >
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/product/${item._id}`}
                                        onClick={closeCart}
                                        className="block"
                                    >
                                        <Text strong className="hover:text-indigo-600" style={{ fontSize: 14 }}>
                                            {item.name}
                                        </Text>
                                        {item.brand && (
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {item.brand}
                                                </Text>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Price */}
                                    <div className="mb-2 mt-1">
                                        {item.originalPrice && item.originalPrice > item.price ? (
                                            <div className="flex items-center gap-2">
                                                <Text strong style={{ color: '#dc2626', fontSize: 14 }}>
                                                    {formatCurrency(item.price)}
                                                </Text>
                                                <Text delete type="secondary" style={{ fontSize: 12 }}>
                                                    {formatCurrency(item.originalPrice)}
                                                </Text>
                                            </div>
                                        ) : (
                                            <Text strong style={{ fontSize: 14 }}>
                                                {formatCurrency(item.price)}
                                            </Text>
                                        )}
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Unit price
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Selected Options */}
                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                        <div className="mb-2">
                                            {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                <Text key={key} type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                                    {key}: {value}
                                                </Text>
                                            ))}
                                        </div>
                                    )}

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(value) => updateQuantity(item.cartItemId, value)}
                                            size="small"
                                            style={{ width: 80 }}
                                        />
                                        <Text type="secondary" style={{ fontSize: 14 }}>
                                            Total: {formatCurrency(item.price * item.quantity)}
                                        </Text>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/product/${item._id}`}
                                            onClick={closeCart}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium text-xs"
                                        >
                                            View product
                                        </Link>
                                        <Button
                                            type="link"
                                            danger
                                            size="small"
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            style={{ padding: 0, height: 'auto', fontSize: 12, fontWeight: 500 }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </Drawer>
    );
};

export default CartDrawer;
