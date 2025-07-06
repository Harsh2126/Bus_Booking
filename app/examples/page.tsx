'use client';

import {
    ArrowRight,
    Code,
    Eye,
    Palette,
    Shield,
    Sparkles,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const frameworks = [
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    icon: Palette,
    color: 'from-blue-500 to-purple-600',
    features: ['Utility classes', 'Responsive design', 'Customizable', 'Small bundle size'],
    href: '/examples/tailwind-example',
    docs: 'https://tailwindcss.com'
  },
  {
    name: 'Chakra UI',
    description: 'Simple, modular and accessible component library',
    icon: Sparkles,
    color: 'from-teal-500 to-cyan-600',
    features: ['Accessible by default', 'Themeable', 'Composable', 'TypeScript support'],
    href: '/examples/chakra-example',
    docs: 'https://chakra-ui.com'
  },
  {
    name: 'Material-UI (MUI)',
    description: 'Google\'s Material Design implementation',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    features: ['Material Design', 'Rich components', 'Theming system', 'Enterprise ready'],
    href: '/examples/mui-example',
    docs: 'https://mui.com'
  },
  {
    name: 'Ant Design',
    description: 'Enterprise-level UI design language and React UI library',
    icon: Shield,
    color: 'from-indigo-500 to-blue-600',
    features: ['Enterprise UI', 'Rich components', 'Form validation', 'Data visualization'],
    href: '/examples/antd-example',
    docs: 'https://ant.design'
  }
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CSS Framework Examples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore different CSS frameworks and choose the one that best fits your project needs. 
            Each example showcases the same bus booking interface implemented with different frameworks.
          </p>
        </div>

        {/* Framework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {frameworks.map((framework) => {
            const IconComponent = framework.icon;
            return (
              <Card key={framework.name} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${framework.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{framework.name}</CardTitle>
                      <CardDescription className="text-base">
                        {framework.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {framework.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <Link href={framework.href}>
                      <Button className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View Example</span>
                      </Button>
                    </Link>
                    <Link href={framework.docs} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>Documentation</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Framework Comparison</CardTitle>
            <CardDescription>
              Compare the key aspects of each framework to make an informed decision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Framework</th>
                    <th className="text-left py-3 px-4 font-semibold">Bundle Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Learning Curve</th>
                    <th className="text-left py-3 px-4 font-semibold">Customization</th>
                    <th className="text-left py-3 px-4 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Tailwind CSS</td>
                    <td className="py-3 px-4">Small</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">High</td>
                    <td className="py-3 px-4">Custom designs, rapid prototyping</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Chakra UI</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Low</td>
                    <td className="py-3 px-4">High</td>
                    <td className="py-3 px-4">Accessible apps, modern interfaces</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Material-UI</td>
                    <td className="py-3 px-4">Large</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Material Design, enterprise apps</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Ant Design</td>
                    <td className="py-3 px-4">Large</td>
                    <td className="py-3 px-4">Low</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Enterprise apps, admin dashboards</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Which Framework Should You Choose?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                The choice depends on your project requirements, team expertise, and design preferences. 
                Visit each example to see how they look and feel in practice.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {frameworks.map((framework) => (
                  <Link key={framework.name} href={framework.href}>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <span>Try {framework.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 