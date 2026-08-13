import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  createUser, 
  getUserById, 
  updateUser, 
  upsertUser,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct
} from './queries';
import { db } from './index';
import type { NewUser, NewProduct } from './schema';

// Mock del módulo de base de datos
vi.mock('./index', () => ({
  db: {
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: {
      users: {
        findFirst: vi.fn(),
      },
      products: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      comments: {
        findMany: vi.fn(),
      },
    },
  },
}));

describe('User Queries', () => {
  const mockUser: NewUser = {
    id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
    imageUrl: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const mockReturning = vi.fn().mockResolvedValue([mockUser]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      (db.insert as any).mockReturnValue({ values: mockValues });

      const result = await createUser(mockUser);

      expect(db.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(mockUser);
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should handle user creation with minimal data', async () => {
      const minimalUser: NewUser = {
        id: 'user_456',
        email: 'minimal@example.com',
      };

      const mockReturning = vi.fn().mockResolvedValue([minimalUser]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      (db.insert as any).mockReturnValue({ values: mockValues });

      const result = await createUser(minimalUser);

      expect(result).toEqual(minimalUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);

      const result = await getUserById('user_123');

      expect(db.query.users.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(undefined);

      const result = await getUserById('nonexistent_id');

      expect(result).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated data when user exists', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);

      const updateData: Partial<NewUser> = {
        name: 'Updated Name',
        imageUrl: 'https://example.com/new-avatar.jpg',
      };

      const updatedUser = { ...mockUser, ...updateData };
      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });

      const result = await updateUser('user_123', updateData);

      expect(db.update).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('upsertUser', () => {
    it('should upsert user using onConflictDoUpdate', async () => {
      const mockReturning = vi.fn().mockResolvedValue([mockUser]);
      const mockOnConflict = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockValues = vi.fn().mockReturnValue({ onConflictDoUpdate: mockOnConflict });
      (db.insert as any).mockReturnValue({ values: mockValues });

      const result = await upsertUser(mockUser);

      expect(db.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(mockUser);
      expect(mockOnConflict).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});

describe('Product Queries', () => {
  const mockProduct: NewProduct = {
    title: 'Test Product',
    description: 'A test product description',
    imageUrl: 'https://example.com/product.jpg',
    userId: 'user_123',
  };

  const mockProductWithId = {
    id: 'product_uuid_123',
    ...mockProduct,
    createdAt: new Date(),
    updatedeAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product and return it', async () => {
      const mockReturning = vi.fn().mockResolvedValue([mockProductWithId]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      (db.insert as any).mockReturnValue({ values: mockValues });

      const result = await createProduct(mockProduct);

      expect(db.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProductWithId);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products with user data', async () => {
      const mockProducts = [
        {
          ...mockProductWithId,
          user: {
            id: 'user_123',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      ];

      (db.query.products.findMany as any).mockResolvedValue(mockProducts);

      const result = await getAllProducts();

      expect(db.query.products.findMany).toHaveBeenCalledWith({
        with: { user: true },
        orderBy: expect.any(Function),
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return product with user and comments', async () => {
      const mockProductWithRelations = {
        ...mockProductWithId,
        user: { id: 'user_123', email: 'test@example.com', name: 'Test User' },
        comments: [],
      };

      (db.query.products.findFirst as any).mockResolvedValue(mockProductWithRelations);

      const result = await getProductById('product_uuid_123');

      expect(result).toEqual(mockProductWithRelations);
    });
  });

  describe('updateProduct', () => {
    it('should update product and return updated data when product exists', async () => {
      (db.query.products.findFirst as any).mockResolvedValue(mockProductWithId);

      const updateData = { title: 'Updated Title' };
      const updatedProduct = { ...mockProductWithId, ...updateData };

      const mockReturning = vi.fn().mockResolvedValue([updatedProduct]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });

      const result = await updateProduct('product_uuid_123', updateData);

      expect(db.update).toHaveBeenCalled();
      expect(result).toEqual(updatedProduct);
    });
  });
});