import { ArrowRight, Bus, Clock, Facebook, Globe, Phone, Shield, Star, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Button } from './components/ui/Button';
import { Card, CardContent } from './components/ui/Card';

const features = [
  { 
    icon: Bus, 
    title: 'Easy Booking', 
    desc: 'Book your bus tickets in just a few clicks with our intuitive interface.',
    color: 'from-blue-500 to-purple-600'
  },
  { 
    icon: Shield, 
    title: 'Secure Payments', 
    desc: 'Your transactions are safe and encrypted with bank-level security.',
    color: 'from-green-500 to-teal-600'
  },
  { 
    icon: Clock, 
    title: 'Real-time Tracking', 
    desc: 'Track your bus in real time from your phone with live updates.',
    color: 'from-orange-500 to-red-600'
  },
  { 
    icon: Phone, 
    title: '24/7 Support', 
    desc: 'We are here to help you anytime, anywhere with dedicated support.',
    color: 'from-purple-500 to-pink-600'
  },
];

const testimonials = [
  { 
    name: 'Amit S.', 
    text: 'Best bus booking experience ever! Super easy and fast. Highly recommend!',
    rating: 5
  },
  { 
    name: 'Priya K.', 
    text: 'I love the real-time tracking and secure payments. Makes traveling so much easier.',
    rating: 5
  },
  { 
    name: 'Rahul M.', 
    text: 'Customer support is fantastic. They helped me resolve my issue within minutes.',
    rating: 5
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow sticky top-0 z-20 px-6 py-4 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-wide">Smartify</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Reviews</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signup">
              <Button variant={"outline"} className="border-blue-500 text-blue-600 hover:bg-blue-50">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative px-6 py-20 lg:py-32 flex items-center justify-center">
        <div className="mx-auto max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center bg-white/80 rounded-2xl shadow-xl p-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Smartify
              </span>{' '}
              Bus Booking
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Book your bus tickets easily, quickly, and securely. Enjoy a smarter way to travel with real-time tracking and premium service!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <Button size={"lg"} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant={"outline"} size={"lg"} className="border-blue-500 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
          <div className="relative flex flex-col items-center">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bus className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Travel Starts Here</h3>
                  <p className="text-gray-700 mb-6">
                    Join thousands of happy travelers who choose Smartify for their journey.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">150+</div>
                      <div className="text-sm text-gray-500">Active Buses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">25</div>
                      <div className="text-sm text-gray-500">Cities</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">10K+</div>
                      <div className="text-sm text-gray-500">Happy Users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white/60">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smartify?
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Experience the future of bus booking with our cutting-edge features and exceptional service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-blue-100 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 bg-gradient-to-br from-blue-100 to-indigo-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our customers have to say about their experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/90 border-blue-100 shadow-lg">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">&quot;{testimonial.text}&quot;</p>
                  <div className="font-bold text-blue-600">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-100 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bus className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Smartify</span>
              </div>
              <p className="text-gray-600 mb-4">
                Making bus travel smarter, safer, and more convenient for everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Our Services</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Bus Booking</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Route Planning</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Real-time Tracking</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Customer Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: info@smartify.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Smartify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
