const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Idea = require('./models/Idea');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Sample ideas with beautiful images
const sampleIdeas = [
  {
    title: 'AI-Powered Smart Home Assistant',
    description: 'A next-generation smart home assistant that uses artificial intelligence to learn your habits and preferences. It can control all your smart devices, anticipate your needs, and make your home truly intelligent. The system uses machine learning to adapt to your lifestyle over time, making your home more efficient and comfortable.',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1201&q=80',
    userId: 'user123',
    userName: 'Tech Innovator'
  },
  {
    title: 'Sustainable Urban Farming Initiative',
    description: 'A community-based urban farming project that transforms unused urban spaces into productive gardens. This initiative aims to increase local food production, reduce carbon footprint from food transportation, and create green spaces in urban environments. The project includes vertical farming techniques, hydroponics, and community education programs.',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    userId: 'user456',
    userName: 'Green Entrepreneur'
  },
  {
    title: 'Virtual Reality Educational Platform',
    description: 'An immersive educational platform that uses virtual reality to make learning more engaging and effective. Students can explore historical sites, conduct virtual science experiments, or practice language skills in simulated real-world environments. The platform adapts to different learning styles and provides personalized learning paths for each student.',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    userId: 'user789',
    userName: 'Education Innovator'
  },
  {
    title: 'Mental Health Tracking App',
    description: 'A comprehensive mental health app that helps users track their mood, sleep, and stress levels. It provides personalized recommendations for improving mental wellbeing based on user data and scientific research. The app includes guided meditation sessions, cognitive behavioral therapy exercises, and connection to professional help when needed.',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
    userId: 'user101',
    userName: 'Health Advocate'
  },
  {
    title: 'Interactive Storytelling Platform',
    description: 'A digital platform that allows users to create and experience interactive stories across multiple media formats. The platform combines elements of gaming, literature, and film to create immersive narratives where the audience can influence the storyline. It supports collaborative storytelling and provides tools for creators to monetize their content.',
    category: 'Entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1159&q=80',
    userId: 'user202',
    userName: 'Creative Director'
  },
  {
    title: 'Ocean Plastic Cleanup Drone',
    description: 'An autonomous drone system designed to collect plastic waste from oceans and waterways. These solar-powered drones can identify, collect, and sort plastic waste, helping to address the global plastic pollution crisis. The collected plastic is then recycled into useful products, creating a circular economy solution to ocean pollution.',
    category: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    userId: 'user303',
    userName: 'Environmental Engineer'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing ideas
    await Idea.deleteMany({});
    console.log('Cleared existing ideas');

    // Add sample ideas
    await Idea.insertMany(sampleIdeas);
    console.log('Added sample ideas');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

// Run the seed function
seedDatabase();
