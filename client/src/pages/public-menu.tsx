import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Twitter, Globe, MapPin, Phone, Mail, Share2, ExternalLink } from "lucide-react";
import { QRCodeGenerator } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Category, MenuItem, Restaurant, SocialMediaLink } from "@shared/schema";

// Social media icon mapping
const socialIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
};

// Interface for the public menu data structure
interface PublicMenuData {
  restaurant: Restaurant;
  categories: (Category & { items: MenuItem[] })[];
  socialLinks: SocialMediaLink[];
}

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Convert slug to restaurantId (we can use more sophisticated slug logic in the future)
  const restaurantId = parseInt(slug);
  
  // Fetch menu data
  const { data: menuData, isLoading, error } = useQuery<PublicMenuData>({
    queryKey: ["/api/public/restaurants", restaurantId, "menu"],
    enabled: !!restaurantId && !isNaN(restaurantId),
  });
  
  // Set first category as active when data loads
  useEffect(() => {
    if (menuData?.categories?.length) {
      setActiveCategory(menuData.categories[0].id);
    }
  }, [menuData]);
  
  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: menuData?.restaurant?.name || "Restaurant Menu",
          text: `Check out ${menuData?.restaurant?.name}'s menu!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard if sharing fails
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען תפריט...</p>
        </div>
      </div>
    );
  }
  
  if (error || !menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">לא נמצא תפריט</h2>
          <p className="text-gray-600 mb-4">התפריט שחיפשת לא נמצא או שאינו זמין כרגע.</p>
          <Button variant="outline" onClick={() => window.history.back()}>חזרה</Button>
        </div>
      </div>
    );
  }
  
  const { restaurant, categories, socialLinks } = menuData;
  
  // Apply restaurant's custom colors
  const primaryColor = restaurant.primaryColor || "#e65100";
  const secondaryColor = restaurant.secondaryColor || "#f57c00";
  
  // Dynamic styled components
  const menuStyle = {
    "--primary-color": primaryColor,
    "--secondary-color": secondaryColor,
    "--bg-color": "#ffffff",
  } as React.CSSProperties;
  
  // Helper function to get active category items
  const getActiveCategoryItems = () => {
    if (!activeCategory) return [];
    const category = categories.find(cat => cat.id === activeCategory);
    return category?.items || [];
  };
  
  return (
    <div 
      className="min-h-screen bg-gray-50 text-right" 
      style={menuStyle}
      dir="rtl"
    >
      {/* Restaurant Header */}
      <header 
        className="p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm"
        style={{ backgroundColor: primaryColor, color: '#fff' }}
      >
        <div className="flex items-center">
          {restaurant.logo ? (
            <img 
              src={restaurant.logo} 
              alt={restaurant.name} 
              className="w-12 h-12 rounded-full border-2 border-white mr-3"
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-white"
              style={{ color: primaryColor }}
            >
              {restaurant.name.charAt(0)}
            </div>
          )}
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => setShowQRCode(!showQRCode)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0v2m0-2v-2m0 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQRCode(false)}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">סרוק לצפייה בתפריט</h3>
              <div className="flex justify-center mb-4">
                <QRCodeGenerator 
                  value={window.location.href}
                  size={200}
                  level="M"
                  includeMargin={true}
                  restaurantName={restaurant.name}
                />
              </div>
              <Button 
                className="w-full"
                style={{ backgroundColor: primaryColor }}
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => {
                  alert("הקישור הועתק!");
                })}
              >
                העתק קישור
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Restaurant Info */}
      {restaurant.description && (
        <div className="p-4 bg-white mb-2">
          <p className="text-gray-700">{restaurant.description}</p>
        </div>
      )}
      
      {/* Restaurant Details */}
      <div className="p-4 bg-white mb-2 flex flex-wrap gap-4 text-sm">
        {restaurant.address && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 ml-1" />
            <span>{restaurant.address}</span>
          </div>
        )}
        {restaurant.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 ml-1" />
            <a href={`tel:${restaurant.phone}`} className="hover:underline">{restaurant.phone}</a>
          </div>
        )}
        {restaurant.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 ml-1" />
            <a href={`mailto:${restaurant.email}`} className="hover:underline">{restaurant.email}</a>
          </div>
        )}
      </div>
      
      {/* Categories Tabs */}
      <Tabs 
        defaultValue={categories[0]?.id.toString()}
        className="bg-white mb-2"
        onValueChange={(value) => setActiveCategory(parseInt(value))}
      >
        <div className="overflow-x-auto">
          <TabsList className="p-1 bg-gray-100 flex w-full mb-0 rounded-none">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id.toString()}
                className="py-2 px-4 flex-shrink-0 data-[state=active]:bg-white"
                style={{ 
                  "--bg-active": primaryColor,
                  "--text-active": "white"
                } as React.CSSProperties}
              >
                <div className="flex items-center gap-2">
                  {category.icon && (
                    <span className="text-lg">{category.icon}</span>
                  )}
                  <span>{category.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Menu Items for each category */}
        {categories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id.toString()}
            className="m-0 p-0"
          >
            {category.items.length > 0 ? (
              <div className="divide-y">
                {category.items.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 flex gap-4"
                  >
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <span className="font-bold" style={{ color: primaryColor }}>₪{item.price}</span>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                אין פריטים בקטגוריה זו
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="p-4 bg-white mb-2">
          <h3 className="font-semibold mb-2">עקבו אחרינו</h3>
          <div className="flex gap-3">
            {socialLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: primaryColor,
                  color: 'white'
                }}
              >
                {socialIcons[link.platform] || <ExternalLink className="h-5 w-5" />}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 bg-white">
        <p>© {new Date().getFullYear()} {restaurant.name}</p>
      </footer>
    </div>
  );
}