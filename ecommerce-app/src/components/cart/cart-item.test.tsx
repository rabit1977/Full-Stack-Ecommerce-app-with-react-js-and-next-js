import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartItem } from './cart-item';
import * as hooks from '@/lib/store/hooks';
import * as cartThunks from '@/lib/store/thunks/cartThunks';
import { CartItem as CartItemType } from '@/lib/types';

// Mock the Redux dispatch hook
const mockDispatch = jest.fn();
jest.mock('@/lib/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

// Mock the entire thunks module
jest.mock('@/lib/store/thunks/cartThunks', () => {
  const originalModule = jest.requireActual('@/lib/store/thunks/cartThunks');
  return {
    __esModule: true,
    ...originalModule,
    updateCartQuantity: jest.fn(() => () => {}),
    removeFromCart: jest.fn(() => () => {}),
    saveForLater: jest.fn(() => () => {}),
  };
});

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

const mockItem: CartItemType = {
  cartItemId: '1',
  id: 'prod1',
  title: 'Test Product',
  price: 100,
  quantity: 2,
  image: '/test-image.jpg',
  options: {
    Color: '#ff0000',
    Size: 'M',
  },
};

describe('CartItem', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders item details correctly', () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument(); // price * quantity
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByText(/Color:/)).toBeInTheDocument();
    expect(screen.getByText(/Size: M/)).toBeInTheDocument();
  });

  it('dispatches the correct thunk when quantity buttons are clicked', () => {
    render(<CartItem item={mockItem} />);

    fireEvent.click(screen.getByLabelText('Decrease quantity'));
    expect(cartThunks.updateCartQuantity).toHaveBeenCalledWith('1', 1);

    fireEvent.click(screen.getByLabelText('Increase quantity'));
    expect(cartThunks.updateCartQuantity).toHaveBeenCalledWith('1', 3);
    
    // Check that dispatch was called (with a function, since it's a thunk)
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it('dispatches the correct thunk when "Save for Later" is clicked', () => {
    render(<CartItem item={mockItem} />);
    fireEvent.click(screen.getByText('Save for Later'));
    expect(cartThunks.saveForLater).toHaveBeenCalledWith('1');
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it('dispatches the correct thunk when "Remove" is clicked', () => {
    render(<CartItem item={mockItem} />);
    fireEvent.click(screen.getByText('Remove'));
    expect(cartThunks.removeFromCart).toHaveBeenCalledWith('1');
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });
});
