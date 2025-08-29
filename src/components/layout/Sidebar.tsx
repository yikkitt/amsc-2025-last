'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { 
  LayoutDashboard, 
  FileText, 
  Info,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Phone,
  Menu,
  X
} from 'lucide-react'
import { useState, memo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// Define the navigation data outside component to avoid re-creation
const orderForms = [
  { id: 'form1', name: 'Form 1: Fascia Name Form', href: '/dashboard/order-forms/form1' },
  { id: 'form2', name: 'Form 2: Contractor Pass Application', href: '/dashboard/order-forms/form2' },
  { id: 'form3', name: 'Form 3: Electrical & Lighting Order', href: '/dashboard/order-forms/form3' },
  { id: 'form4', name: 'Form 4: Furniture Order', href: '/dashboard/order-forms/form4' },
  { id: 'form5', name: 'Form 5: Printing Order', href: '/dashboard/order-forms/form5' },
  { id: 'form6', name: 'Form 6: Performance Bond', href: '/dashboard/order-forms/form6' },
  { id: 'form7', name: 'Form 7: Admin Fees', href: '/dashboard/order-forms/form7' },
  { id: 'form8', name: 'Form 8: Letter of Indemnity', href: '/dashboard/order-forms/indemnity-letter' },
  { id: 'form9', name: 'Form 9: AV Equipment', href: '/dashboard/order-forms/form9' },
]

const informationSections = [
  { id: 'general', name: 'General Information', href: '/dashboard/information/general' },
  { id: 'emergency', name: 'Emergency Evacuation', href: '/dashboard/information/emergency' },
  { id: 'special-design', name: 'Special Design Rules', href: '/dashboard/information/special-design' },
  { id: 'electrical', name: 'Electrical Rules', href: '/dashboard/information/electrical' },
  { id: 'venue', name: 'Venue Rules', href: '/dashboard/information/venue' },
  { id: 'schedule', name: 'Exhibition Schedule', href: '/dashboard/information/schedule' },
]

const appendixItems = [
  { id: 'booth-package', name: 'Guide for Booth Package', href: '/dashboard/appendix/booth-package' },
  { id: 'klcc-map', name: 'KLCC Map', href: '/dashboard/appendix/klcc-map' },
  { id: 'shell-scheme', name: 'Do & Don\'t of Shell Scheme', href: '/dashboard/appendix/shell-scheme' },
  { id: 'design-submission', name: 'Design Submission Guidelines', href: '/dashboard/appendix/design-submission' },
  { id: 'special-design', name: 'Sample of Special Design Stand Submission', href: '/dashboard/appendix/special-design-sample' },
  { id: 'custom-booth', name: 'Customized Booth Design Guidelines', href: '/dashboard/appendix/custom-booth' },
  { id: 'working-condition', name: 'Working Condition', href: '/dashboard/appendix/working-condition' },
  { id: 'emergency-plan', name: 'KLCC\'s Emergency Response Plan', href: '/dashboard/appendix/emergency-plan' },
  { id: 'vehicle-pass', name: 'Vehicle Pass', href: '/dashboard/appendix/vehicle-pass' },
]

// Memoize the navigation sections
const NavLink = memo(({ href, isActive, onClick, children }: {
  href: string,
  isActive: boolean,
  onClick?: () => void,
  children: React.ReactNode
}) => (
  <Link
    href={href}
    className={cn(
      "block px-3 py-2 rounded-lg text-sm transition-colors",
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100"
    )}
    onClick={onClick}
  >
    {children}
  </Link>
));

// Memoize section components to prevent re-renders
const OrderFormsSection = memo(({ pathname, onLinkClick }: { pathname: string | null, onLinkClick?: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = pathname?.includes('/order-forms') || false;
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors",
          isActive 
            ? "bg-blue-50 text-blue-700" 
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5" />
          <span className="font-medium">Order Forms</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 ml-4 space-y-1">
          {orderForms.map((form) => (
            <NavLink
              key={form.id}
              href={form.href}
              isActive={pathname === form.href}
              onClick={onLinkClick}
            >
              {form.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
});

const InformationSection = memo(({ pathname, onLinkClick }: { pathname: string | null, onLinkClick?: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = pathname?.includes('/information') || false;
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5" />
          <span className="font-medium">Information</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 ml-4 space-y-1">
          {informationSections.map((section) => (
            <NavLink
              key={section.id}
              href={section.href}
              isActive={pathname === section.href}
              onClick={onLinkClick}
            >
              {section.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
});

const AppendixSection = memo(({ pathname, onLinkClick }: { pathname: string | null, onLinkClick?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname?.includes('/appendix') || false;
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center space-x-3">
          <Bookmark className="w-5 h-5" />
          <span className="font-medium">Appendix</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 ml-4 space-y-1">
          {appendixItems.map((item) => (
            <NavLink
              key={item.id}
              href={item.href}
              isActive={pathname === item.href}
              onClick={onLinkClick}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
});

// Mobile menu toggle button
const MobileMenuToggle = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
  <button
    onClick={toggle}
    className="fixed top-4 left-4 z-[100] lg:hidden bg-white p-2 rounded-full shadow-md border border-gray-200"
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Add CSS once for the scrollbar
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .mobile-sidebar-scroll {
        -webkit-overflow-scrolling: touch;
      }
      .mobile-sidebar-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .mobile-sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .mobile-sidebar-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 20px;
      }
      body.sidebar-open {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);
  
  // Handle window resize
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobileMenuOpen]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Add CSS for better mobile scrolling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 1023px) {
        body {
          position: relative;
        }
        body.sidebar-open {
          overflow: hidden;
          touch-action: none;
        }
        main {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  if (!isMounted) {
    // Return a placeholder with the same width to avoid layout shift
    return <div className="hidden lg:block w-72 shrink-0" />;
  }
  
  return (
    <>
      <MobileMenuToggle isOpen={isMobileMenuOpen} toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className={cn(
        "fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden transition-opacity duration-300",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} 
      onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-gray-200 pt-16 pb-4 px-4 transition-transform duration-300 lg:transition-none lg:translate-x-0 lg:relative lg:pt-4 lg:z-0",
          "mobile-sidebar-scroll overflow-y-auto max-h-screen",
          isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"
        )}
      >
        <div className="flex justify-center mb-6">
          <Link href="/dashboard" onClick={handleCloseMobileMenu}>
            <Image 
              src="/images/amsc-logo.jpg" 
              alt="DDCON Logo" 
              width={120} 
              height={60} 
              className="h-16 w-auto" 
              priority
              quality={85}
              loading="eager"
              fetchPriority="high"
            />
          </Link>
        </div>
        <div className="space-y-4 pb-20 lg:pb-0">
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              pathname === '/dashboard' 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            prefetch={true}
            onClick={handleCloseMobileMenu}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <OrderFormsSection pathname={pathname} onLinkClick={handleCloseMobileMenu} />
          <InformationSection pathname={pathname} onLinkClick={handleCloseMobileMenu} />
          <AppendixSection pathname={pathname} onLinkClick={handleCloseMobileMenu} />

          <Link 
            href="/dashboard/contact-us" 
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              pathname === '/dashboard/contact-us' 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            prefetch={true}
            onClick={handleCloseMobileMenu}
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">Contact Us</span>
          </Link>
        </div>
      </div>
    </>
  )
} 