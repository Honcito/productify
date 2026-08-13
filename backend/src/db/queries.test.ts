import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  createUser, 
  getUserById, 
  updateUser, 
  upsertUser,
  createProduct,
  getAllProducts,
  getProductById
} from './queries';
import { db } from './index';
import type { NewUser, NewProduct } from './schema';

// Mock the database module
vi.mock('./index', () => ({
  db: {
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      users: {
        findFirst: vi.fn(),
      },
      products: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
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
    it('should update user and return updated data', async () => {
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
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'Only Name Updated' };
      const updatedUser = { ...mockUser, ...partialUpdate };

      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });

      const result = await updateUser('user_123', partialUpdate);

      expect(result.name).toBe('Only Name Updated');
    });
  });

  describe('upsertUser', () => {
    it('should create user if not exists', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(undefined);

      const mockReturning = vi.fn().mockResolvedValue([mockUser]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      (db.insert as any).mockReturnValue({ values: mockValues });

      const result = await upsertUser(mockUser);

      expect(db.query.users.findFirst).toHaveBeenCalled();
      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should update user if already exists', async () => {
      const existingUser = { ...mockUser };
      (db.query.users.findFirst as any).mockResolvedValue(existingUser);

      const updatedData = { ...mockUser, name: 'Updated via Upsert' };
      const mockReturning = vi.fn().mockResolvedValue([updatedData]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });

      const result = await upsertUser(mockUser);

      expect(db.query.users.findFirst).toHaveBeenCalled();
      expect(db.update).toHaveBeenCalled();
      expect(db.insert).not.toHaveBeenCalled();
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

    it('should create product with all required fields', async () => {
      const mockReturning = vi.fn().mockResolvedValue([mockProductWithId]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      (db.insert as any).mockReturnValue({ values: mockValues });

      const result = await createProduct(mockProduct);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title', mockProduct.title);
      expect(result).toHaveProperty('userId', mockProduct.userId);
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
      expect(result[0]).toHaveProperty('user');
    });

    it('should return empty array when no products exist', async () => {
      (db.query.products.findMany as any).mockResolvedValue([]);

      const result = await getAllProducts();

      expect(result).toEqual([]);
    });

    it('should order products by createdAt descending', async () => {
      const product1 = { ...mockProductWithId, createdAt: new Date('2024-01-01') };
      const product2 = { ...mockProductWithId, createdAt: new Date('2024-01-02') };

      (db.query.products.findMany as any).mockResolvedValue([product2, product1]);

      const result = await getAllProducts();

      // Verify orderBy function was called
      expect(db.query.products.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.any(Function),
        })
      );
    });
  });

  describe('getProductById', () => {
    it('should return product with user and comments', async () => {
      const mockProductWithRelations = {
        ...mockProductWithId,
        user: {
          id: 'user_123',
          email: 'test@example.com',
          name: 'Test User',
        },
        comments: [
          {
            id: 'comment_1',
            content: 'Great product!',
            userId: 'user_456',
            productId: mockProductWithId.id,
            createdAt: new Date(),
            user: {
              id: 'user_456',
              email: 'commenter@example.com',
              name: 'Commenter',
            },
          },
        ],
      };

      (db.query.products.findFirst as any).mockResolvedValue(mockProductWithRelations);

      const result = await getProductById('product_uuid_123');

      expect(db.query.products.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          user: true,
          comments: {
            with: { user: true },
            orderBy: expect.any(Function),
          },
        },
      });
      expect(result).toEqual(mockProductWithRelations);
      expect(result?.user).toBeDefined();
      expect(result?.comments).toHaveLength(1);
    });

    it('should return undefined when product not found', async () => {
      (db.query.products.findFirst as any).mockResolvedValue(undefined);

      const result = await getProductById('nonexistent_id');

      expect(result).toBeUndefined();
    });

    it('should return product with empty comments array', async () => {
      const mockProductNoComments = {
        ...mockProductWithId,
        user: { id: 'user_123', email: 'test@example.com', name: 'Test User' },
        comments: [],
      };

      (db.query.products.findFirst as any).mockResolvedValue(mockProductNoComments);

      const result = await getProductById('product_uuid_123');

      expect(result?.comments).toEqual([]);
    });
  });
});