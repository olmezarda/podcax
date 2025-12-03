export type Slide = {
  key: string;
  title: string;
  description: string;
  animation: any;
};

const slides = [
  {
    key: '1',
    title: 'Welcome to PodcaX',
    description: 'Discover amazing podcasts and explore new topics that interest you. Start your journey into the world of audio content effortlessly.',
    animation: require('../../assets/animations/creator.json'),
  },
  {
    key: '2',
    title: 'Listener Onboarding',
    description: 'Follow your favorite podcasts, get personalized recommendations, and enjoy listening anytime, anywhere.',
    animation: require('../../assets/animations/listener.json'),
  },
  {
    key: '3',
    title: 'Social Onboarding',
    description: 'Engage with other podcast lovers, share your thoughts, and connect with the community around your favorite shows.',
    animation: require('../../assets/animations/social.json'),
  },
];

export default slides;
