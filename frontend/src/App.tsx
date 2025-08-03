import React, { useState } from 'react';
import './styles/App.css';
import UserProfileComponent from './components/UserProfile';
import ChatInterface from './components/ChatInterface';
import MealPlan from './components/MealPlan';
import { UserProfile } from './types/index';

type AppView = 'profile' | 'chat' | 'mealplan';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('chat');
  };

  const handleEditProfile = () => {
    setCurrentView('profile');
  };

  const handleViewMealPlan = () => {
    setCurrentView('mealplan');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  return (
    <div className="App">
      {currentView === 'profile' && (
        <UserProfileComponent onProfileComplete={handleProfileComplete} />
      )}
      
      {currentView === 'chat' && userProfile && (
        <ChatInterface 
          userProfile={userProfile} 
          onEditProfile={handleEditProfile}
          onViewMealPlan={handleViewMealPlan}
        />
      )}
      
      {currentView === 'mealplan' && userProfile && (
        <MealPlan 
          userProfile={userProfile} 
          onBack={handleBackToChat}
        />
      )}
    </div>
  );
}

export default App;