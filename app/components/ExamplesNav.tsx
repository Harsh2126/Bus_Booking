'use client';

import { Palette, Shield, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

const frameworks = [
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    icon: Palette,
    color: 'from-blue-500 to-purple-600',
    href: '/examples/tailwind-example'
  },
  {
    name: 'Chakra UI',
    description: 'Accessible component library',
    icon: Sparkles,
    color: 'from-teal-500 to-cyan-600',
    href: '/examples/chakra-example'
  },
  {
    name: 'Material-UI',
    description: 'Material Design components',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    href: '/examples/mui-example'
  },
  {
    name: 'Ant Design',
    description: 'Enterprise UI library',
    icon: Shield,
    color: 'from-indigo-500 to-blue-600',
    href: '/examples/antd-example'
  }
];

export default function ExamplesNav() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-3">CSS Frameworks</h3>
        <div className="space-y-2">
          {frameworks.map((framework) => {
            const IconComponent = framework.icon;
            return (
              <Link key={framework.name} href={framework.href}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-2 h-auto p-2"
                >
                  <div className={`w-6 h-6 bg-gradient-to-r ${framework.color} rounded flex items-center justify-center`}>
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{framework.name}</div>
                    <div className="text-xs text-gray-500">{framework.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t">
          <Link href="/examples">
            <Button variant="outline" size="sm" className="w-full">
              View All Examples
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 