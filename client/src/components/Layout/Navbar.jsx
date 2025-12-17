import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, Dropdown, Badge, Drawer, Button } from 'antd';
import {
    ShoppingOutlined,
    SearchOutlined,
    MenuOutlined,
    UserOutlined,
    GlobalOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';

// Styled Components
const NavContainer = styled.nav`
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 50;
  font-family: ${props => props.theme.typography.fontFamily};
`;

const TopBar = styled.div`
  background-color: ${props => props.theme.colors.gray50};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

const TopBarContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  color: ${props => props.theme.colors.textSecondary};
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 32px;
  }
`;

const TopBarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const MainNav = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 32px;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  
  .logo-text {
    font-size: 2rem;
    font-weight: ${props => props.theme.typography.fontWeight.black};
    letter-spacing: -0.05em;
    color: ${props => props.theme.colors.textPrimary};
    line-height: 1;
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 2.25rem;
    }
  }
  
  .logo-subtitle {
    font-size: ${props => props.theme.typography.fontSize.xs};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.primary};
    letter-spacing: 0.2em;
  }
`;

const DesktopNav = styled.div`
  display: none;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 100%;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 4px;
  transition: color ${props => props.theme.transitions.fast};
  position: relative;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transform: scaleX(0);
    transition: transform ${props => props.theme.transitions.fast};
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const NavButton = styled.button`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 4px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color ${props => props.theme.transitions.fast};
  position: relative;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transform: scaleX(0);
    transition: transform ${props => props.theme.transitions.fast};
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
  
  .anticon-down {
    font-size: 10px;
  }
`;

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchContainer = styled.div`
  position: fixed;
  top: 121px;
  left: 0;
  right: 0;
  background: white;
  padding: 20px 16px;
  box-shadow: ${props => props.theme.shadows.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  z-index: 40;
  transform: translateY(${props => props.$show ? '0' : '-100%'});
  opacity: ${props => props.$show ? '1' : '0'};
  transition: all ${props => props.theme.transitions.normal};
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 28px 32px;
  }
`;

const SearchBarWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchBar = styled.form`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textPrimary};
  background: white;
  transition: all ${props => props.theme.transitions.fast};
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.textPrimary};
  }
`;

const SearchIcon = styled(SearchOutlined)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const CloseButton = styled(Button)`
  && {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.textSecondary};
    
    &:hover {
      color: ${props => props.theme.colors.textPrimary};
    }
  }
`;


const IconButton = styled(Button)`
  && {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 18px;
    
    &:hover {
      color: ${props => props.theme.colors.textPrimary} !important;
    }
  }
`;

const MegaMenuContainer = styled.div`
  background: white;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.borderLight};
  padding: 32px;
  width: 600px;
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const MegaMenuGrid = styled.div`
  display: flex;
  gap: 24px;
`;

const MegaMenuSection = styled.div`
  flex: 1;
  padding: 0 12px;
  border-right: 1px solid ${props => props.theme.colors.borderLight};
  
  &:last-child {
    border-right: none;
  }
`;

const MegaMenuTitle = styled.h3`
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 16px;
  text-transform: uppercase;
  font-size: ${props => props.theme.typography.fontSize.xs};
  letter-spacing: 0.1em;
`;

const MegaMenuLink = styled(Link)`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px 0;
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// Navigation structure
const navStructure = {
    shop: {
        name: 'Shop',
        type: 'mega',
        sections: [
            {
                title: 'Featured',
                items: [
                    'Bestsellers', 'Sets & Bundles', 'Black Friday Sale', 'Christmas Gift Shopping',
                    'Funbaruz Posture Pals', '2026 Calendars', '2025 Stationery Awards',
                    'Studio Ghibli', 'Signature Original', 'Signature Postcards', 'Personalized Engraving'
                ]
            },
            {
                title: 'By Category',
                items: ['Pens', 'Pencils', 'Paper', 'Notebooks', 'Accessories', 'Gifts']
            },
            {
                title: 'By Brand',
                items: ['Midori', 'Pilot', 'Tombow', 'Uni', 'Kokuyo', 'Zebra']
            }
        ]
    },
    new: {
        name: 'New',
        type: 'dropdown',
        items: [
            { name: 'New Arrivals', href: '/collections/new-arrivals' }
        ]
    },
    deals: {
        name: 'Deals',
        type: 'dropdown',
        items: [
            { name: 'All Deals', href: '/collections/deals-all' },
            { name: 'On Sale', href: '/collections/on-sale' },
            { name: 'Clearance', href: '/collections/clearance' },
            { name: 'Production-Used', href: '/collections/production-used' }
        ]
    },
    brands: {
        name: 'Brands',
        type: 'mega',
        sections: [
            {
                title: 'A-D',
                items: [
                    { name: 'ACTIVE CORPORATION', href: '/collections/active-corporation' },
                    { name: 'Akashiya', href: '/collections/akashiya' },
                    { name: 'Clairefontaine', href: '/collections/clairefontaine' }
                ]
            },
            {
                title: 'E-K',
                items: [
                    { name: 'Kokuyo', href: '/collections/kokuyo' },
                    { name: 'Kaweco', href: '/collections/kaweco' }
                ]
            },
            {
                title: 'L-R',
                items: [
                    { name: 'maruman', href: '/collections/maruman' },
                    { name: 'Midori DESIGNPHIL', href: '/collections/midori-designphil' },
                    { name: 'MUJI', href: '/collections/muji' },
                    { name: 'Pilot', href: '/collections/pilot' }
                ]
            },
            {
                title: 'S-Z & Others',
                items: [
                    { name: 'SAKURA', href: '/collections/sakura' },
                    { name: 'Sanrio', href: '/collections/sanrio' },
                    { name: 'Studio Ghibli', href: '/collections/studio-ghibli' },
                    { name: 'Tombow', href: '/collections/tombow' },
                    { name: 'Uni', href: '/collections/uni' },
                    { name: 'Zebra', href: '/collections/zebra' }
                ]
            }
        ]
    },
    reads: {
        name: 'Reads',
        type: 'link',
        href: '/reads'
    },
    rewards: {
        name: 'Rewards',
        type: 'link',
        href: '/rewards',
        label: 'Rewards'
    },
    about: {
        name: 'About Us',
        type: 'link',
        href: '/pages/about'
    },
    contact: {
        name: 'Contact Us',
        type: 'link',
        href: '/pages/contact'
    }
};

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toggleCart, getCartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    // Create mega menu content
    const createMegaMenu = (sections) => (
        <MegaMenuContainer>
            <MegaMenuGrid>
                {sections.map((section, idx) => (
                    <MegaMenuSection key={idx}>
                        <MegaMenuTitle>
                            {section.title}
                        </MegaMenuTitle>
                        <div>
                            {section.items.map((subItem) => {
                                const itemHref = typeof subItem === 'string'
                                    ? `/shop?filter=${subItem}`
                                    : subItem.href;
                                const itemName = typeof subItem === 'string'
                                    ? subItem
                                    : subItem.name;

                                return (
                                    <MegaMenuLink
                                        key={itemName}
                                        to={itemHref}
                                    >
                                        {itemName}
                                    </MegaMenuLink>
                                );
                            })}
                        </div>
                    </MegaMenuSection>
                ))}
            </MegaMenuGrid>
        </MegaMenuContainer>
    );

    // Create dropdown menu items
    const createDropdownItems = (items, key) => {
        return items.map((subItem) => {
            const itemHref = typeof subItem === 'string'
                ? `/${key}/${subItem.toLowerCase().replace(/\s+/g, '-')}`
                : subItem.href;
            const itemName = typeof subItem === 'string'
                ? subItem
                : subItem.name;

            return {
                key: itemName,
                label: <Link to={itemHref}>{itemName}</Link>,
            };
        });
    };

    return (
        <NavContainer>
            {/* Top Bar */}
            <TopBar>
                <TopBarContent>
                    <TopBarButton>
                        <GlobalOutlined style={{ fontSize: 14 }} />
                        Region: Global (USD)
                    </TopBarButton>
                    <Link to="/login">
                        <TopBarButton>
                            <UserOutlined style={{ fontSize: 14 }} />
                            Log in
                        </TopBarButton>
                    </Link>
                </TopBarContent>
            </TopBar>

            <MainNav>
                <NavContent>
                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <IconButton
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setMobileMenuOpen(true)}
                        />
                    </div>

                    {/* Logo */}
                    <Logo to="/">
                        <span className="logo-text">signature</span>
                        <span className="logo-subtitle">+1</span>
                    </Logo>

                    {/* Desktop Navigation */}
                    <DesktopNav>
                        {Object.entries(navStructure).map(([key, item]) => {
                            if (item.type === 'link') {
                                return (
                                    <NavLink
                                        key={key}
                                        to={item.href}
                                    >
                                        {item.label || item.name}
                                    </NavLink>
                                );
                            }

                            if (item.type === 'mega') {
                                return (
                                    <Dropdown
                                        key={key}
                                        dropdownRender={() => createMegaMenu(item.sections)}
                                        trigger={['hover']}
                                    >
                                        <NavButton>
                                            {item.name}
                                            <DownOutlined />
                                        </NavButton>
                                    </Dropdown>
                                );
                            }

                            if (item.type === 'dropdown') {
                                return (
                                    <Dropdown
                                        key={key}
                                        menu={{ items: createDropdownItems(item.items, key) }}
                                        trigger={['hover']}
                                    >
                                        <NavButton>
                                            {item.name}
                                            <DownOutlined />
                                        </NavButton>
                                    </Dropdown>
                                );
                            }

                            return null;
                        })}
                    </DesktopNav>

                    {/* Right Side Icons */}
                    <RightIcons>
                        <IconButton
                            type="text"
                            icon={<SearchOutlined />}
                            onClick={() => setSearchOpen(!searchOpen)}
                        />
                        <Badge count={getCartCount()} offset={[-2, 2]}>
                            <IconButton
                                type="text"
                                icon={<ShoppingOutlined />}
                                onClick={toggleCart}
                            />
                        </Badge>
                    </RightIcons>
                </NavContent>
            </MainNav>

            {/* Search Overlay */}
            <SearchContainer $show={searchOpen}>
                <SearchBarWrapper>
                    <SearchBar onSubmit={handleSearch}>
                        <SearchIcon />
                        <SearchInput
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus={searchOpen}
                        />
                    </SearchBar>
                    <CloseButton
                        type="text"
                        onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                        }}
                    >
                        Close
                    </CloseButton>
                </SearchBarWrapper>
            </SearchContainer>

            {/* Mobile Menu Drawer */}
            < Drawer
                title="Menu"
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={300}
            >
                <div className="space-y-4">
                    {Object.entries(navStructure).map(([key, item]) => (
                        <div key={key} className="border-b border-gray-100 pb-4">
                            <div className="font-bold text-gray-900 uppercase text-sm mb-2">
                                {item.name}
                            </div>
                            {item.sections && (
                                <div className="pl-4 space-y-2">
                                    {item.sections.map((section) => (
                                        <div key={section.title}>
                                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                {section.title}
                                            </div>
                                            {section.items.map((subItem) => {
                                                const itemHref = typeof subItem === 'string'
                                                    ? `/shop?filter=${subItem}`
                                                    : subItem.href;
                                                const itemName = typeof subItem === 'string' ? subItem : subItem.name;
                                                return (
                                                    <Link
                                                        key={itemName}
                                                        to={itemHref}
                                                        className="block text-sm text-gray-600 py-1 hover:text-indigo-600"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {itemName}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {item.items && (
                                <div className="pl-4 space-y-1">
                                    {item.items.map((subItem) => {
                                        const itemHref = typeof subItem === 'string'
                                            ? `/${key}/${subItem.toLowerCase().replace(/\s+/g, '-')}`
                                            : subItem.href;
                                        const itemName = typeof subItem === 'string' ? subItem : subItem.name;
                                        return (
                                            <Link
                                                key={itemName}
                                                to={itemHref}
                                                className="block text-sm text-gray-600 py-1 hover:text-indigo-600"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {itemName}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                            {item.type === 'link' && (
                                <Link
                                    to={item.href}
                                    className="block text-sm text-gray-600 py-1 hover:text-indigo-600 pl-4"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label || item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </Drawer >
        </NavContainer >
    );
};

export default Navbar;
