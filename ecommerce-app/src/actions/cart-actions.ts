// actions/cart-actions.ts
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Add item to cart
 * NOTE: Stock is NOT decremented here. Stock is only decremented when an order is placed.
 * This prevents inventory issues from abandoned carts.
 */
export async function addItemToCartAction(
  productId: string,
  quantity: number = 1,
  options?: Record<string, string>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }
  const userId = session.user.id;

  try {
    // Use a transaction for data integrity
    return await prisma.$transaction(async (tx) => {
      // 1. Check product exists and has sufficient stock
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { 
          id: true, 
          stock: true, 
          title: true,
          inBundles: {
            include: {
              product: {
                select: { id: true, stock: true, title: true }
              }
            }
          }
        },
      });

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      // 2. Check existing cart quantity for this product
      const existingCartItems = await tx.cartItem.findMany({
        where: { userId, productId },
      });
      
      const currentCartQuantity = existingCartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalRequestedQuantity = currentCartQuantity + quantity;

      // 3. Validate stock availability (check against total cart quantity, not just this request)
      if (product.stock < totalRequestedQuantity) {
        const availableToAdd = product.stock - currentCartQuantity;
        if (availableToAdd <= 0) {
          return {
            success: false,
            message: `You already have the maximum available quantity (${product.stock}) in your cart`,
          };
        }
        return {
          success: false,
          message: `Only ${availableToAdd} more ${product.title} available.`,
        };
      }

      // 3.1 Validate Bundle Components Stock
      if (product.inBundles && product.inBundles.length > 0) {
        for (const bundleItem of product.inBundles) {
          const requiredComponentQty = bundleItem.quantity * totalRequestedQuantity;
          const component = bundleItem.product;
          
          if (component.stock < requiredComponentQty) {
             const maxBundleQty = Math.floor(component.stock / bundleItem.quantity);
             const availableToAdd = Math.max(0, maxBundleQty - currentCartQuantity);

             return {
                success: false,
                message: `Not enough stock for component "${component.title}". Only ${maxBundleQty} bundles available.`,
             };
          }
        }
      }

      // 4. Handle cleanup (remove from Wishlist/Saved for Later when adding to cart)
      const optionsToSave = options && Object.keys(options).length > 0 ? options : {};
      
      await tx.wishlistItem.deleteMany({ where: { userId, productId } });
      await tx.savedForLater.deleteMany({ where: { userId, productId } });

      // 5. Update or Create Cart Item
      const existingCartItem = await tx.cartItem.findFirst({
        where: { userId, productId, selectedOptions: optionsToSave },
      });

      if (existingCartItem) {
        await tx.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            userId,
            productId,
            quantity,
            selectedOptions: optionsToSave,
          },
        });
      }

      // NOTE: Stock is NOT decremented here - only on order creation
      
      revalidatePath('/cart');
      revalidatePath('/wishlist');
      revalidatePath(`/product/${productId}`);
      
      return { success: true, message: 'Item added to cart' };
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in addItemToCartAction:', error);
    return { 
      success: false, 
      message: errorMessage === 'Product not found' ? errorMessage : 'Failed to add to cart' 
    };
  }
}

/**
 * Update cart item quantity
 * Validates against current stock before updating
 */
export async function updateCartItemQuantityAction(
  cartItemId: string,
  quantity: number
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    if (quantity <= 0) {
      return removeCartItemAction(cartItemId);
    }

    return await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findFirst({
        where: { id: cartItemId, userId: session.user.id },
        include: { 
          product: { 
            select: { 
              stock: true, 
              title: true,
              inBundles: {
                include: {
                  product: {
                    select: { id: true, stock: true, title: true }
                  }
                }
              }
            } 
          } 
        },
      });

      if (!cartItem) {
        return { success: false, message: 'Cart item not found' };
      }

      // Validate that requested quantity doesn't exceed available stock
      if (quantity > cartItem.product.stock) {
        return {
          success: false,
          message: `Only ${cartItem.product.stock} items available in stock`,
        };
      }

      // Validate Bundle Components
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productWithBundles = cartItem.product as any;
      if (productWithBundles.inBundles && productWithBundles.inBundles.length > 0) {
         for (const bundleItem of productWithBundles.inBundles) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const component = bundleItem.product as any;
            const requiredQty = bundleItem.quantity * quantity;
            
            if (component.stock < requiredQty) {
                const maxQty = Math.floor(component.stock / bundleItem.quantity);
                return {
                    success: false,
                    message: `Not enough stock for component "${component.title}". Max bundles: ${maxQty}`,
                };
            }
         }
      }

      await tx.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });

      revalidatePath('/cart');
      return { success: true, message: 'Quantity updated' };
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return { success: false, message: 'Failed to update quantity' };
  }
}

/**
 * Remove item from cart
 * NOTE: Stock is NOT restored here since it was never decremented
 */
export async function removeCartItemAction(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: session.user.id },
    });

    if (!cartItem) {
      return { success: false, message: 'Cart item not found' };
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath('/cart');
    revalidatePath(`/product/${cartItem.productId}`);
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return { success: false, message: 'Failed to remove item' };
  }
}

/**
 * Save item for later (move from cart to saved)
 */
export async function saveForLaterAction(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: session.user.id },
    });

    if (!cartItem) {
      return { success: false, message: 'Cart item not found' };
    }

    await prisma.$transaction([
      // Check if already saved
      prisma.savedForLater.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: cartItem.productId,
          },
        },
        update: {}, // No update needed if exists
        create: {
          userId: session.user.id,
          productId: cartItem.productId,
        },
      }),
      prisma.cartItem.delete({
        where: { id: cartItemId },
      }),
    ]);

    revalidatePath('/cart');
    return { success: true, message: 'Item saved for later' };
  } catch (error) {
    console.error('Error saving item for later:', error);
    return { success: false, message: 'Failed to save item for later' };
  }
}

/**
 * Clear all items from cart
 */
export async function clearCartAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });
    
    revalidatePath('/cart');
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, message: 'Failed to clear cart' };
  }
}

/**
 * Get cart with all items and saved for later
 */
export async function getCartAction() {
  const session = await auth();
  const emptyCart = { items: [], savedForLater: [], user: null };

  if (!session?.user?.id) {
    return emptyCart;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cartItems: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let savedForLaterItems: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any = null;

    try {
      cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            include: {
              images: { select: { id: true, url: true } },
              reviews: {
                select: {
                  id: true,
                  userId: true,
                  rating: true,
                  title: true,
                  comment: true,
                  helpful: true,
                  verifiedPurchase: true,
                  createdAt: true,
                  user: { select: { name: true } }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }

    try {
      savedForLaterItems = await prisma.savedForLater.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            include: {
              images: { select: { id: true, url: true } },
              reviews: {
                select: {
                  id: true,
                  userId: true,
                  rating: true,
                  title: true,
                  comment: true,
                  helpful: true,
                  verifiedPurchase: true,
                  createdAt: true,
                  user: { select: { name: true } }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }

    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { coupon: true },
      });
    } catch (_error) {
      console.warn('Warning: Failed to fetch user data. Using session fallback.');
      if (!user && session.user) {
         user = { 
           ...session.user, 
           coupon: null,
           couponId: null
         };
      }
    }
    
    return {
      items: cartItems,
      savedForLater: savedForLaterItems,
      user,
    };
  } catch (globalError) {
    console.error('Global error in getCartAction:', globalError);
    return emptyCart;
  }
}

/**
 * Remove item from saved for later list
 */
export async function removeSavedForLaterItemAction(savedItemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    await prisma.savedForLater.delete({
      where: { id: savedItemId, userId: session.user.id },
    });
    revalidatePath('/cart');
    return { success: true, message: 'Item removed from saved for later' };
  } catch (error) {
    console.error('Error removing saved item:', error);
    return { success: false, message: 'Failed to remove item' };
  }
}

/**
 * Move item from saved for later back to cart
 */
export async function moveToCartAction(savedItemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const savedItem = await prisma.savedForLater.findFirst({
      where: { id: savedItemId, userId: session.user.id },
      include: { product: { select: { stock: true, title: true } } },
    });

    if (!savedItem) {
      return { success: false, message: 'Item not found' };
    }

    // Check if product is in stock
    if (savedItem.product.stock <= 0) {
      return { 
        success: false, 
        message: `"${savedItem.product.title}" is currently out of stock` 
      };
    }

    // Use addItemToCartAction which handles all the logic including stock validation
    const addResult = await addItemToCartAction(savedItem.productId, 1);

    if (!addResult.success) {
      return { success: false, message: addResult.message || 'Failed to move to cart' };
    }
    
    // addItemToCartAction already removes the item from saved for later
    revalidatePath('/cart');
    return { success: true, message: 'Item moved to cart' };
  } catch (error) {
    console.error('Error moving item to cart:', error);
    return { success: false, message: 'Failed to move item to cart' };
  }
}