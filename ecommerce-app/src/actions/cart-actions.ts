// actions/cart-actions.ts
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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
    // Start a transaction to ensure data integrity
    return await prisma.$transaction(async (tx) => {
      // 1. Check current stock with a read (or use update with a where clause)
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, stock: true },
      });

      if (!product) throw new Error('Product not found');
      
      // 2. Validate stock availability
      if (product.stock < quantity) {
        return {
          success: false,
          message: `Only ${product.stock} items available`,
        };
      }

      // 3. Decrease the stock immediately
      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      // 4. Handle cleanup (Wishlist/Saved for Later)
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

      revalidatePath('/cart');
      revalidatePath('/wishlist');
      revalidatePath(`/product/${productId}`); // Revalidate product page to show new stock
      
      return { success: true, message: 'Item added to cart and stock updated' };
    });
  } catch (error: any) {
    console.error('Error in addItemToCartAction:', error);
    return { 
      success: false, 
      message: error.message === 'Product not found' ? error.message : 'Failed to add to cart' 
    };
  }
}

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

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: session.user.id },
      include: { product: { select: { stock: true } } },
    });

    if (!cartItem) {
      return { success: false, message: 'Cart item not found' };
    }

    if (quantity > cartItem.product.stock) {
      return {
        success: false,
        message: `Only ${cartItem.product.stock} items available`,
      };
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    revalidatePath('/cart');
    return { success: true, message: 'Quantity updated' };
  } catch (error) {
    return { success: false, message: 'Failed to update quantity' };
  }
}

export async function removeCartItemAction(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId, userId: session.user.id },
    });

    revalidatePath('/cart');
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    return { success: false, message: 'Failed to remove item' };
  }
}

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
      prisma.savedForLater.create({
        data: {
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
    // Handle potential unique constraint violation if item already saved
    return { success: false, message: 'Failed to save item for later' };
  }
}

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
    return { success: false, message: 'Failed to clear cart' };
  }
}

export async function getCartAction() {
  const session = await auth();
  const emptyCart = { items: [], savedForLater: [], user: null };

  if (!session?.user?.id) {
    return emptyCart;
  }

  try {
    const results = await Promise.all([
      prisma.cartItem.findMany({
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
      }),
      prisma.savedForLater.findMany({
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
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: { coupon: true },
      }),
    ]);
    const [cartItems, savedForLaterItems, user] = results;
    
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: cartItems as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      savedForLater: savedForLaterItems as any,
      user,
    };
  } catch (error) {
    return emptyCart;
  }
}

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
        return { success: false, message: 'Failed to remove item' };
    }
}

export async function moveToCartAction(savedItemId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const savedItem = await prisma.savedForLater.findFirst({
            where: { id: savedItemId, userId: session.user.id },
        });

        if (!savedItem) {
            return { success: false, message: 'Item not found' };
        }

        // Use addItemToCartAction to handle adding the product to the cart
        const addResult = await addItemToCartAction(savedItem.productId, 1);

        if (!addResult.success) {
            // If adding to cart failed, don't remove it from saved for later
            return { success: false, message: addResult.message || 'Failed to move to cart' };
        }
        
        // addItemToCartAction already handles removing the product from saved for later
        // so we just need to return the result
        
        revalidatePath('/cart');
        return { success: true, message: 'Item moved to cart' };
    } catch (error) {
        return { success: false, message: 'Failed to move item to cart' };
    }
}