import React, { useState } from 'react';
import { UserProfile } from '../types/index';

interface UserProfileProps {
  onProfileComplete: (profile: UserProfile) => void;
}

const UserProfileComponent: React.FC<UserProfileProps> = ({ onProfileComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 18,
    gender: 'male',
    location: '',
    height: 170,
    weight: 70,
    activityLevel: 'moderately_active',
    healthGoal: 'maintain_weight',
    dietaryRestrictions: [],
    allergies: [],
    healthConditions: [],
    culturalPreferences: '',
    mealsPerDay: 3,
    budget: 'medium'
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof UserProfile, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setProfile(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileComplete(profile);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>🥗 NutriPal - Your AI Nutrition Assistant</h2>
        <p>Let's get to know you better to provide personalized nutrition advice</p>
        <div className="progress-bar">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location (City, Country):</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                placeholder="e.g., Mumbai, India"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Height (cm):</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                  min="100"
                  max="250"
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                  min="30"
                  max="200"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={nextStep} className="btn-primary">
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Health & Goals */}
        {currentStep === 2 && (
          <div className="form-step">
            <h3>Health & Goals</h3>
            
            <div className="form-group">
              <label>Activity Level:</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              >
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Health Goal:</label>
              <select
                value={profile.healthGoal}
                onChange={(e) => handleInputChange('healthGoal', e.target.value)}
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain_weight">Maintain Weight</option>
                <option value="gain_weight">Gain Weight</option>
                <option value="build_muscle">Build Muscle</option>
                <option value="improve_health">Improve Overall Health</option>
              </select>
            </div>

            <div className="form-group">
              <label>Health Conditions (separate with commas):</label>
              <input
                type="text"
                value={profile.healthConditions.join(', ')}
                onChange={(e) => handleArrayChange('healthConditions', e.target.value)}
                placeholder="e.g., diabetes, hypertension, thyroid"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Meals per Day:</label>
                <select
                  value={profile.mealsPerDay}
                  onChange={(e) => handleInputChange('mealsPerDay', parseInt(e.target.value))}
                >
                  <option value={2}>2 meals</option>
                  <option value={3}>3 meals</option>
                  <option value={4}>4 meals</option>
                  <option value={5}>5 meals</option>
                  <option value={6}>6 meals</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget:</label>
                <select
                  value={profile.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                >
                  <option value="low">Low Budget</option>
                  <option value="medium">Medium Budget</option>
                  <option value="high">High Budget</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">
                ← Previous
              </button>
              <button type="button" onClick={nextStep} className="btn-primary">
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dietary Preferences */}
        {currentStep === 3 && (
          <div className="form-step">
            <h3>Dietary Preferences</h3>
            
            <div className="form-group">
              <label>Dietary Restrictions (separate with commas):</label>
              <input
                type="text"
                value={profile.dietaryRestrictions.join(', ')}
                onChange={(e) => handleArrayChange('dietaryRestrictions', e.target.value)}
                placeholder="e.g., vegetarian, vegan, keto, paleo"
              />
            </div>

            <div className="form-group">
              <label>Allergies (separate with commas):</label>
              <input
                type="text"
                value={profile.allergies.join(', ')}
                onChange={(e) => handleArrayChange('allergies', e.target.value)}
                placeholder="e.g., nuts, dairy, gluten, shellfish"
              />
            </div>

            <div className="form-group">
              <label>Cultural/Regional Food Preferences:</label>
              <input
                type="text"
                value={profile.culturalPreferences}
                onChange={(e) => handleInputChange('culturalPreferences', e.target.value)}
                placeholder="e.g., Indian, Mediterranean, Asian"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">
                ← Previous
              </button>
              <button type="submit" className="btn-success">
                Start Using NutriPal! ✨
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfileComponent;