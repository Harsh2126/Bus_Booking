'use client';

import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    Grid,
    Heading,
    HStack,
    Icon,
    Input,
    Text,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
import { FaBus, FaClock, FaMapMarkerAlt, FaStar, FaUsers } from 'react-icons/fa';
import { ChakraProvider } from '../../providers/ChakraProvider';

function ChakraExampleContent() {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, indigo.100)',
    'linear(to-br, gray.900, blue.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={8}>
      <Container maxW="6xl">
        {/* Header */}
        <VStack spacing={6} mb={12} textAlign="center">
          <Heading size="2xl" color={textColor}>
            Chakra UI Example
          </Heading>
          <Text fontSize="xl" color={mutedTextColor}>
            Modern, accessible design with Chakra UI
          </Text>
        </VStack>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={12}>
          <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
            <CardBody p={6}>
              <HStack spacing={3}>
                <Box p={2} bg="blue.100" borderRadius="lg">
                  <Icon as={FaBus} h={6} w={6} color="blue.600" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    150+
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Active Buses
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
            <CardBody p={6}>
              <HStack spacing={3}>
                <Box p={2} bg="green.100" borderRadius="lg">
                  <Icon as={FaMapMarkerAlt} h={6} w={6} color="green.600" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    25
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Cities
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
            <CardBody p={6}>
              <HStack spacing={3}>
                <Box p={2} bg="purple.100" borderRadius="lg">
                  <Icon as={FaClock} h={6} w={6} color="purple.600" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    24/7
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Support
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
            <CardBody p={6}>
              <HStack spacing={3}>
                <Box p={2} bg="orange.100" borderRadius="lg">
                  <Icon as={FaUsers} h={6} w={6} color="orange.600" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    10K+
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Happy Users
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Feature Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8} mb={12}>
          <Card 
            bg={cardBg} 
            shadow="md" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
          >
            <CardHeader>
              <VStack spacing={4} align="start">
                <Box 
                  w={12} 
                  h={12} 
                  bgGradient="linear(to-r, blue.500, purple.600)" 
                  borderRadius="lg" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Icon as={FaBus} h={6} w={6} color="white" />
                </Box>
                <Heading size="md">Easy Booking</Heading>
                <Text color={mutedTextColor}>
                  Book your bus tickets in just a few clicks with our intuitive interface.
                </Text>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              <Button colorScheme="brand" width="full">
                Learn More
              </Button>
            </CardBody>
          </Card>

          <Card 
            bg={cardBg} 
            shadow="md" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
          >
            <CardHeader>
              <VStack spacing={4} align="start">
                <Box 
                  w={12} 
                  h={12} 
                  bgGradient="linear(to-r, green.500, teal.600)" 
                  borderRadius="lg" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Icon as={FaMapMarkerAlt} h={6} w={6} color="white" />
                </Box>
                <Heading size="md">Real-time Tracking</Heading>
                <Text color={mutedTextColor}>
                  Track your bus location in real-time and get live updates on your journey.
                </Text>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              <Button colorScheme="brand" width="full">
                Learn More
              </Button>
            </CardBody>
          </Card>

          <Card 
            bg={cardBg} 
            shadow="md" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
          >
            <CardHeader>
              <VStack spacing={4} align="start">
                <Box 
                  w={12} 
                  h={12} 
                  bgGradient="linear(to-r, orange.500, red.600)" 
                  borderRadius="lg" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Icon as={FaStar} h={6} w={6} color="white" />
                </Box>
                <Heading size="md">Premium Service</Heading>
                <Text color={mutedTextColor}>
                  Enjoy premium amenities and comfortable travel with our luxury buses.
                </Text>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              <Button colorScheme="brand" width="full">
                Learn More
              </Button>
            </CardBody>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Card bg={cardBg} shadow="lg" maxW="2xl" mx="auto">
          <CardHeader>
            <VStack spacing={2} align="start">
              <Heading size="lg">Get in Touch</Heading>
              <Text color={mutedTextColor}>
                Have questions? We&apos;d love to hear from you.
              </Text>
            </VStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} width="full">
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    First Name
                  </Text>
                  <Input placeholder="Enter your first name" />
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    Last Name
                  </Text>
                  <Input placeholder="Enter your last name" />
                </VStack>
              </Grid>
              <VStack align="start" spacing={2} width="full">
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Email
                </Text>
                <Input type="email" placeholder="Enter your email" />
              </VStack>
              <VStack align="start" spacing={2} width="full">
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Message
                </Text>
                <Input as="textarea" placeholder="Enter your message" h={20} />
              </VStack>
              <Button colorScheme="brand" size="lg" width="full">
                Send Message
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default function ChakraExample() {
  return (
    <ChakraProvider>
      <ChakraExampleContent />
    </ChakraProvider>
  );
} 