import { db } from './index';
import { eq } from 'drizzle-orm';
import { users, comments, products, type NewUser, type NewComment, type NewProduct} from './schema'


// USER QUERIES

export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning()
    return user;
};

export const getUserById = async (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning()
    return user;
};

// upsert => create or update
export const upsertUser = async(data: NewUser) => {
    const existingUser = await getUserById(data.id);
    if (existingUser) return updateUser(data.id, data);
        return createUser(data);
};

// PRODUCTS QUERIES
export const createProduct = async (data: NewProduct) => {
    const [product] = await db.insert(products).values(data).returning()
    return product;
};

export const getAllProducts = async () => {
    return db.query.products.findMany({ 
        with: { user: true },
        orderBy: (products, {desc}) => [desc(products.createdAt)], // desc means: you will see the latest products first
        // the square brackets are required because Drizzle ORM's orderBy expects an array, even for a single column.  
    });
};

export const getProductById = async(id: string) => {
    return db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            user: true,
            comments: {
                with: {user: true},
                orderBy: (comments, { desc }) => [desc(comments.createdAt)],
            },
        },
    });
};