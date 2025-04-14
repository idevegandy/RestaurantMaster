import { 
  users, User, InsertUser,
  restaurants, Restaurant, InsertRestaurant,
  categories, Category, InsertCategory,
  menuItems, MenuItem, InsertMenuItem,
  socialMediaLinks, SocialMediaLink, InsertSocialMediaLink,
  qrCodes, QRCode, InsertQRCode,
  activityLogs, ActivityLog, InsertActivityLog 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Restaurant operations
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurantData: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: number): Promise<boolean>;
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurantsByAdminId(adminId: number): Promise<Restaurant[]>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getCategoriesByRestaurantId(restaurantId: number): Promise<Category[]>;

  // Menu item operations
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItemData: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  getMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]>;
  getMenuItemsByCategoryId(categoryId: number): Promise<MenuItem[]>;

  // Social media operations
  getSocialMediaLink(id: number): Promise<SocialMediaLink | undefined>;
  createSocialMediaLink(link: InsertSocialMediaLink): Promise<SocialMediaLink>;
  updateSocialMediaLink(id: number, linkData: Partial<InsertSocialMediaLink>): Promise<SocialMediaLink | undefined>;
  deleteSocialMediaLink(id: number): Promise<boolean>;
  getSocialMediaLinksByRestaurantId(restaurantId: number): Promise<SocialMediaLink[]>;

  // QR code operations
  getQRCode(id: number): Promise<QRCode | undefined>;
  createQRCode(qrCode: InsertQRCode): Promise<QRCode>;
  deleteQRCode(id: number): Promise<boolean>;
  getQRCodesByRestaurantId(restaurantId: number): Promise<QRCode[]>;

  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogsByRestaurantId(restaurantId: number): Promise<ActivityLog[]>;
  getRecentActivityLogs(limit: number): Promise<ActivityLog[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private restaurants: Map<number, Restaurant>;
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private socialMediaLinks: Map<number, SocialMediaLink>;
  private qrCodes: Map<number, QRCode>;
  private activityLogs: Map<number, ActivityLog>;

  private userIdCounter: number = 1;
  private restaurantIdCounter: number = 1;
  private categoryIdCounter: number = 1;
  private menuItemIdCounter: number = 1;
  private socialMediaLinkIdCounter: number = 1;
  private qrCodeIdCounter: number = 1;
  private activityLogIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.categories = new Map();
    this.menuItems = new Map();
    this.socialMediaLinks = new Map();
    this.qrCodes = new Map();
    this.activityLogs = new Map();

    // Initialize with a super admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      name: "Super Admin",
      email: "admin@example.com",
      role: "super_admin"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser: User = {
      ...existingUser,
      ...userData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Restaurant operations
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(restaurantData: InsertRestaurant): Promise<Restaurant> {
    const id = this.restaurantIdCounter++;
    const now = new Date();
    const restaurant: Restaurant = {
      ...restaurantData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: number, restaurantData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const existingRestaurant = this.restaurants.get(id);
    if (!existingRestaurant) return undefined;

    const updatedRestaurant: Restaurant = {
      ...existingRestaurant,
      ...restaurantData,
      updatedAt: new Date()
    };
    this.restaurants.set(id, updatedRestaurant);
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    return this.restaurants.delete(id);
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurantsByAdminId(adminId: number): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(restaurant => restaurant.adminId === adminId);
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const now = new Date();
    const category: Category = {
      ...categoryData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;

    const updatedCategory: Category = {
      ...existingCategory,
      ...categoryData,
      updatedAt: new Date()
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getCategoriesByRestaurantId(restaurantId: number): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(category => category.restaurantId === restaurantId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // Menu item operations
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(menuItemData: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemIdCounter++;
    const now = new Date();
    const menuItem: MenuItem = {
      ...menuItemData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, menuItemData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingMenuItem = this.menuItems.get(id);
    if (!existingMenuItem) return undefined;

    const updatedMenuItem: MenuItem = {
      ...existingMenuItem,
      ...menuItemData,
      updatedAt: new Date()
    };
    this.menuItems.set(id, updatedMenuItem);
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.restaurantId === restaurantId);
  }

  async getMenuItemsByCategoryId(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.categoryId === categoryId);
  }

  // Social media operations
  async getSocialMediaLink(id: number): Promise<SocialMediaLink | undefined> {
    return this.socialMediaLinks.get(id);
  }

  async createSocialMediaLink(linkData: InsertSocialMediaLink): Promise<SocialMediaLink> {
    const id = this.socialMediaLinkIdCounter++;
    const now = new Date();
    const link: SocialMediaLink = {
      ...linkData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.socialMediaLinks.set(id, link);
    return link;
  }

  async updateSocialMediaLink(id: number, linkData: Partial<InsertSocialMediaLink>): Promise<SocialMediaLink | undefined> {
    const existingLink = this.socialMediaLinks.get(id);
    if (!existingLink) return undefined;

    const updatedLink: SocialMediaLink = {
      ...existingLink,
      ...linkData,
      updatedAt: new Date()
    };
    this.socialMediaLinks.set(id, updatedLink);
    return updatedLink;
  }

  async deleteSocialMediaLink(id: number): Promise<boolean> {
    return this.socialMediaLinks.delete(id);
  }

  async getSocialMediaLinksByRestaurantId(restaurantId: number): Promise<SocialMediaLink[]> {
    return Array.from(this.socialMediaLinks.values()).filter(link => link.restaurantId === restaurantId);
  }

  // QR code operations
  async getQRCode(id: number): Promise<QRCode | undefined> {
    return this.qrCodes.get(id);
  }

  async createQRCode(qrCodeData: InsertQRCode): Promise<QRCode> {
    const id = this.qrCodeIdCounter++;
    const now = new Date();
    const qrCode: QRCode = {
      ...qrCodeData,
      id,
      createdAt: now
    };
    this.qrCodes.set(id, qrCode);
    return qrCode;
  }

  async deleteQRCode(id: number): Promise<boolean> {
    return this.qrCodes.delete(id);
  }

  async getQRCodesByRestaurantId(restaurantId: number): Promise<QRCode[]> {
    return Array.from(this.qrCodes.values()).filter(qrCode => qrCode.restaurantId === restaurantId);
  }

  // Activity log operations
  async createActivityLog(logData: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogIdCounter++;
    const now = new Date();
    const log: ActivityLog = {
      ...logData,
      id,
      createdAt: now
    };
    this.activityLogs.set(id, log);
    return log;
  }

  async getActivityLogsByRestaurantId(restaurantId: number): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.restaurantId === restaurantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentActivityLogs(limit: number): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

// Export storage instance
export const storage = new MemStorage();
