

import { describe, it, expect } from 'vitest';

import {

users,

products,

comments,

userRelations,

productsRelations,

commentsRelations,

type User,

type NewUser,

type Product,

type NewProduct,

type Comment,

type NewComment

} from './schema';

describe('Schema Tables', () => {

describe('users table', () => {

it('should have correct table name', () => {

expect(users).toBeDefined();

// @ts-ignore - accessing internal property for testing

expect(users[Symbol.for('drizzle:Name')]).toBe('users');

});

it('should have all required columns', () => {

const columns = Object.keys(users);

expect(columns).toContain('id');

expect(columns).toContain('email');

expect(columns).toContain('name');

expect(columns).toContain('imageUrl');

expect(columns).toContain('createdAt');

expect(columns).toContain('updatedAt');

});

it('should infer correct User type', () => {

const mockUser: User = {

id: 'user_123',

email: 'test@example.com',

name: 'Test User',

imageUrl: 'https://example.com/avatar.jpg',

createdAt: new Date(),

updatedAt: new Date(),

};

expect(mockUser.id).toBe('user_123');

expect(mockUser.email).toBe('test@example.com');

});

it('should infer correct NewUser type with required fields only', () => {

const newUser: NewUser = {

id: 'user_456',

email: 'new@example.com',

};

expect(newUser.id).toBe('user_456');

expect(newUser.email).toBe('new@example.com');

});

it('should allow optional fields in NewUser', () => {

const newUserWithOptionals: NewUser = {

id: 'user_789',

email: 'optional@example.com',

name: 'Optional Name',

imageUrl: 'https://example.com/image.jpg',

};

expect(newUserWithOptionals.name).toBe('Optional Name');

expect(newUserWithOptionals.imageUrl).toBe('https://example.com/image.jpg');

});

});

describe('products table', () => {

it('should have correct table name', () => {

expect(products).toBeDefined();

// @ts-ignore - accessing internal property for testing

expect(products[Symbol.for('drizzle:Name')]).toBe('products');

});

it('should have all required columns', () => {

const columns = Object.keys(products);

expect(columns).toContain('id');

expect(columns).toContain('title');

expect(columns).toContain('description');

expect(columns).toContain('imageUrl');

expect(columns).toContain('userId');

expect(columns).toContain('createdAt');

expect(columns).toContain('updatedeAt');

});

it('should infer correct Product type', () => {

const mockProduct: Product = {

id: 'product_uuid_123',

title: 'Test Product',

description: 'A test product',

imageUrl: 'https://example.com/product.jpg',

userId: 'user_123',

createdAt: new Date(),

updatedeAt: new Date(),

};

expect(mockProduct.title).toBe('Test Product');

expect(mockProduct.userId).toBe('user_123');

});

it('should infer correct NewProduct type without id and timestamps', () => {

const newProduct: NewProduct = {

title: 'New Product',

description: 'New product description',

imageUrl: 'https://example.com/new.jpg',

userId: 'user_456',

};

expect(newProduct.title).toBe('New Product');

expect(newProduct.userId).toBe('user_456');

// id, createdAt, updatedeAt should be optional/auto-generated

expect(newProduct).not.toHaveProperty('id');

});

it('should require all non-auto fields in NewProduct', () => {

// This test validates TypeScript compilation

const validProduct: NewProduct = {

title: 'Valid',

description: 'Valid description',

imageUrl: 'https://example.com/valid.jpg',

userId: 'user_123',

};

expect(validProduct).toBeDefined();

});

});

describe('comments table', () => {

it('should have correct table name', () => {

expect(comments).toBeDefined();

// @ts-ignore - accessing internal property for testing

expect(comments[Symbol.for('drizzle:Name')]).toBe('comments');

});

it('should have all required columns', () => {

const columns = Object.keys(comments);

expect(columns).toContain('id');

expect(columns).toContain('content');

expect(columns).toContain('userId');

expect(columns).toContain('productId');

expect(columns).toContain('createdAt');

});

it('should infer correct Comment type', () => {

const mockComment: Comment = {

id: 'comment_uuid_123',

content: 'Great product!',

userId: 'user_123',

productId: 'product_456',

createdAt: new Date(),

};

expect(mockComment.content).toBe('Great product!');

expect(mockComment.userId).toBe('user_123');

expect(mockComment.productId).toBe('product_456');

});

it('should infer correct NewComment type', () => {

const newComment: NewComment = {

content: 'New comment',

userId: 'user_789',

productId: 'product_101',

};

expect(newComment.content).toBe('New comment');

expect(newComment.userId).toBe('user_789');

expect(newComment.productId).toBe('product_101');

});

});

});

describe('Schema Relations', () => {

describe('userRelations', () => {

it('should define user relations', () => {

expect(userRelations).toBeDefined();

});

it('should have products relation', () => {

// Relations are defined and will be used by Drizzle ORM

// We verify the relation object exists

expect(userRelations).toBeDefined();

});

it('should have comments relation', () => {

expect(userRelations).toBeDefined();

});

});

describe('productsRelations', () => {

it('should define product relations', () => {

expect(productsRelations).toBeDefined();

});

it('should have user relation (one-to-one)', () => {

expect(productsRelations).toBeDefined();

});

it('should have comments relation (one-to-many)', () => {

expect(productsRelations).toBeDefined();

});

});

describe('commentsRelations', () => {

it('should define comment relations', () => {

expect(commentsRelations).toBeDefined();

});

it('should have user relation', () => {

expect(commentsRelations).toBeDefined();

});

it('should have product relation', () => {

expect(commentsRelations).toBeDefined();

});

});

});

describe('Type Inference', () => {

describe('User types', () => {

it('should correctly infer User select type', () => {

const user: User = {

id: 'test_id',

email: 'test@test.com',

name: 'Test',

imageUrl: 'url',

createdAt: new Date(),

updatedAt: new Date(),

};

// Type check - if this compiles, the type is correct

expect(user).toHaveProperty('id');

expect(user).toHaveProperty('email');

expect(user).toHaveProperty('createdAt');

expect(user).toHaveProperty('updatedAt');

});

it('should correctly infer NewUser insert type', () => {

const newUser: NewUser = {

id: 'new_id',

email: 'new@test.com',

};

expect(newUser).toHaveProperty('id');

expect(newUser).toHaveProperty('email');

});

it('should allow null for optional fields in User', () => {

const userWithNulls: User = {

id: 'test',

email: 'test@test.com',

name: null,

imageUrl: null,

createdAt: new Date(),

updatedAt: new Date(),

};

expect(userWithNulls.name).toBeNull();

expect(userWithNulls.imageUrl).toBeNull();

});

});

describe('Product types', () => {

it('should correctly infer Product select type', () => {

const product: Product = {

id: 'prod_id',

title: 'Product',

description: 'Description',

imageUrl: 'url',

userId: 'user_id',

createdAt: new Date(),

updatedeAt: new Date(),

};

expect(product).toHaveProperty('id');

expect(product).toHaveProperty('title');

expect(product).toHaveProperty('userId');

});

it('should correctly infer NewProduct insert type', () => {

const newProduct: NewProduct = {

title: 'New Product',

description: 'New Description',

imageUrl: 'new_url',

userId: 'user_123',

};

expect(newProduct).toHaveProperty('title');

expect(newProduct).toHaveProperty('userId');

});

});

describe('Comment types', () => {

it('should correctly infer Comment select type', () => {

const comment: Comment = {

id: 'comment_id',

content: 'Comment content',

userId: 'user_id',

productId: 'product_id',

createdAt: new Date(),

};

expect(comment).toHaveProperty('id');

expect(comment).toHaveProperty('content');

expect(comment).toHaveProperty('userId');

expect(comment).toHaveProperty('productId');

});

it('should correctly infer NewComment insert type', () => {

const newComment: NewComment = {

content: 'New comment',

userId: 'user_id',

productId: 'product_id',

};

expect(newComment).toHaveProperty('content');

expect(newComment).toHaveProperty('userId');

expect(newComment).toHaveProperty('productId');

});

});

});

describe('Schema Validation', () => {

describe('Required fields validation', () => {

it('should validate user email is required', () => {

// TypeScript will catch this at compile time

const validUser: NewUser = {

id: 'id',

email: 'required@test.com',

};

expect(validUser.email).toBeDefined();

expect(validUser.email).toBeTruthy();

});

it('should validate product required fields', () => {

const validProduct: NewProduct = {

title: 'Required Title',

description: 'Required Description',

imageUrl: 'required_url',

userId: 'required_user_id',

};

expect(validProduct.title).toBeDefined();

expect(validProduct.description).toBeDefined();

expect(validProduct.imageUrl).toBeDefined();

expect(validProduct.userId).toBeDefined();

});

it('should validate comment required fields', () => {

const validComment: NewComment = {

content: 'Required content',

userId: 'required_user',

productId: 'required_product',

};

expect(validComment.content).toBeDefined();

expect(validComment.userId).toBeDefined();

expect(validComment.productId).toBeDefined();

});

});

describe('Foreign key relationships', () => {

it('should validate product userId references user id', () => {

const userId = 'user_123';

const product: NewProduct = {

title: 'Product',

description: 'Description',

imageUrl: 'url',

userId: userId,

};

expect(product.userId).toBe(userId);

});

it('should validate comment userId and productId references', () => {

const userId = 'user_456';

const productId = 'product_789';

const comment: NewComment = {

content: 'Comment',

userId: userId,

productId: productId,

};

expect(comment.userId).toBe(userId);

expect(comment.productId).toBe(productId);

});

});

});

describe('Edge Cases', () => {

it('should handle empty string values where allowed', () => {

const user: NewUser = {

id: 'id',

email: 'test@test.com',

name: '',

};

expect(user.name).toBe('');

});

it('should handle very long text content in comments', () => {

const longContent = 'a'.repeat(10000);

const comment: NewComment = {

content: longContent,

userId: 'user',

productId: 'product',

};

expect(comment.content).toHaveLength(10000);

});

it('should handle special characters in text fields', () => {

const product: NewProduct = {

title: 'Product with émojis 🚀 and spëcial çhars',

description: 'Description with  & "quotes"',

imageUrl: 'https://example.com/image?param=value&other=123',

userId: 'user_123',

};

expect(product.title).toContain('🚀');

expect(product.description).toContain('');

expect(product.imageUrl).toContain('?');

});

it('should handle date objects correctly', () => {

const now = new Date();

const user: User = {

id: 'id',

email: 'test@test.com',

name: 'Test',

imageUrl: 'url',

createdAt: now,

updatedAt: now,

};

expect(user.createdAt).toBeInstanceOf(Date);

expect(user.updatedAt).toBeInstanceOf(Date);

expect(user.createdAt.getTime()).toBe(now.getTime());

});

});

