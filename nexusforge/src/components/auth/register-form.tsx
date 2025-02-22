'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Role configurations
const roles = [
  { 
    id: 'STUDENT', 
    title: 'Student', 
    icon: '/icons/student.svg',
    description: 'Perfect for architecture students looking to learn from experienced professionals.',
    features: ['Access to mentorship', 'Learning resources', 'Project collaboration', 'Portfolio building']
  },
  { 
    id: 'PROFESSIONAL', 
    title: 'Professional', 
    icon: '/icons/professional.svg',
    description: 'For practicing architects seeking clients and project management tools.',
    features: ['Client management', 'Project tracking', 'Business tools', 'Optional mentorship']
  },
  { 
    id: 'VETERAN', 
    title: 'Veteran', 
    icon: '/icons/veteran.svg',
    description: 'Experienced architects who want to share knowledge and mentor others.',
    features: ['Mentorship platform', 'Knowledge sharing', 'Legacy project showcase', 'Community recognition']
  },
  { 
    id: 'CLIENT', 
    title: 'Client', 
    icon: '/icons/client.svg',
    description: 'For individuals or organizations looking to hire architectural services.',
    features: ['Find architects', 'Project requests', 'Budget management', 'Progress tracking']
  },
]

// Country configurations
const countries = [
  {
    id: 'NIGERIA',
    name: 'Nigeria',
    flag: '/images/nigeria-flag.svg',
    video: '/videos/nigerian-flag.mp4',
    description: 'Explore Nigerian architecture, connect with local professionals, and access region-specific resources.',
    features: [
      'Nigerian building codes and regulations',
      'Local material suppliers and costs',
      'Regional architectural styles',
      'Nigerian architecture community'
    ]
  },
  {
    id: 'UNITED_STATES',
    name: 'United States',
    flag: '/images/us-flag.svg',
    video: '/videos/us-flag.mp4',
    description: 'Access US-specific architectural resources, building codes, and connect with American professionals.',
    features: [
      'US building codes and zoning laws',
      'American material suppliers',
      'Regional American architectural styles',
      'US architecture community'
    ]
  }
]

// Form schema with multi-step validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['STUDENT', 'PROFESSIONAL', 'VETERAN', 'CLIENT']),
  gender: z.enum(['MALE', 'FEMALE'], {
    required_error: 'Please select your gender'
  }),
  country: z.enum(['NIGERIA', 'UNITED_STATES'], {
    required_error: 'Please select your country'
  }),
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [formComplete, setFormComplete] = useState(false)
  const [rolePreview, setRolePreview] = useState<string | null>(null)
  const [countryPreview, setCountryPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: undefined,
      role: undefined,
      gender: undefined
    }
  })

  const selectedRole = watch('role')
  const selectedCountry = watch('country')
  const email = watch('email')
  const password = watch('password')
  const name = watch('name')
  const gender = watch('gender')

  // Validate current step
  const validateStep = async () => {
    let isStepValid = false;
    
    switch (currentStep) {
      case 1: // Role selection
        isStepValid = await trigger('role');
        break;
      case 2: // Country selection
        isStepValid = await trigger('country');
        break;
      case 3: // Personal info
        isStepValid = await trigger(['name', 'gender', 'email', 'password']);
        break;
      default:
        isStepValid = false;
    }
    
    return isStepValid;
  }

  // Navigate to next step
  const nextStep = async () => {
    const isStepValid = await validateStep();
    
    if (isStepValid) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        setFormComplete(true);
      }
    }
  }

  // Go back to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }

  // Submit the form
  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          name: data.name.trim(),
          email: data.email.toLowerCase(),
        }),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }
  
      const signInResult = await signIn('credentials', {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      })
  
      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }
  
      // Simplified dashboard routing
      const dashboardRoutes = {
        'STUDENT': '/student/dashboard',
        'PROFESSIONAL': '/professional/dashboard',
        'VETERAN': '/veteran/dashboard',
        'CLIENT': '/client/dashboard'
      }
  
      const dashboardRoute = `${dashboardRoutes[data.role]}?country=${data.country}`
      
      router.push(dashboardRoute)
      
    } catch (error: any) {
      console.error('Registration/Login error:', error)
      setError(error.message || 'Something went wrong. Please try again.')
      setFormComplete(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update role preview when role changes
  useEffect(() => {
    if (selectedRole) {
      setRolePreview(selectedRole)
    }
  }, [selectedRole])

  // Update country preview when country changes  
  useEffect(() => {
    if (selectedCountry) {
      setCountryPreview(selectedCountry)
    }
  }, [selectedCountry])

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div 
            key={step}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${currentStep === step 
                ? 'bg-blue-600 text-white' 
                : currentStep > step 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
            `}
          >
            {currentStep > step ? <Check className="h-5 w-5" /> : step}
          </div>
        ))}
      </div>
    )
  }

  // Get current selected role data
  const getSelectedRoleData = () => {
    return roles.find(role => role.id === selectedRole)
  }

  // Get current selected country data
  const getSelectedCountryData = () => {
    return countries.find(country => country.id === selectedCountry)
  }

  // Render role selection step
  const renderRoleStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Select how you'll use NexusForge to tailor your experience
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setValue('role', role.id as RegisterForm['role'])}
              className={`
                relative p-4 border rounded-lg text-center hover:border-blue-500
                ${selectedRole === role.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700'}
                transition-all duration-200
              `}
            >
              <Image
                src={role.icon}
                alt={role.title}
                width={40}
                height={40}
                className="mx-auto mb-2 object-contain dark:invert"
              />
              <span className="block text-sm font-medium">{role.title}</span>
            </button>
          ))}
        </div>
        
        {selectedRole && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h3 className="font-medium text-lg mb-2">
                {getSelectedRoleData()?.title} Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {getSelectedRoleData()?.description}
              </p>
              <div className="space-y-2">
                {getSelectedRoleData()?.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        {errors.role && (
          <p className="text-sm text-red-600 mt-2">{errors.role.message}</p>
        )}
      </div>
    )
  }

  // Render country selection step
  const renderCountryStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Select Your Location</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Choose your country to access localized architectural resources
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {countries.map((country) => (
            <button
              key={country.id}
              type="button"
              onClick={() => setValue('country', country.id as RegisterForm['country'])}
              className={`
                relative p-4 border rounded-lg hover:border-blue-500
                ${selectedCountry === country.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700'}
                transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <Image
                  src={country.flag}
                  alt={country.name}
                  width={40}
                  height={30}
                  className="object-contain"
                />
                <span className="font-medium">{country.name}</span>
              </div>
              
              {/* Show country video or illustration if selected */}
              {selectedCountry === country.id && country.video && (
                <div className="mt-2 rounded-md overflow-hidden">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-20 object-cover"
                  >
                    <source src={country.video} type="video/mp4" />
                  </video>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {selectedCountry && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h3 className="font-medium text-lg mb-2">
                {getSelectedCountryData()?.name} Architecture
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {getSelectedCountryData()?.description}
              </p>
              <div className="space-y-2">
                {getSelectedCountryData()?.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        {errors.country && (
          <p className="text-sm text-red-600 mt-2">{errors.country.message}</p>
        )}
      </div>
    )
  }

  // Render personal information step
  const renderPersonalInfoStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Your Information</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Tell us a bit about yourself to complete your profile
          </p>
        </div>
        
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            {...register('name')}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Gender Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender
          </label>
          <div className="mt-1 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                {...register('gender')}
                type="radio"
                value="MALE"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                {...register('gender')}
                type="radio"
                value="FEMALE"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Female</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>
    )
  }

  // Render confirmation step (review of selections)
  const renderConfirmation = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Create Your Account</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Review your information before continuing
          </p>
        </div>
        
        <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          {/* Role Summary */}
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Image
                src={getSelectedRoleData()?.icon || ''}
                alt={getSelectedRoleData()?.title || ''}
                width={30}
                height={30}
                className="dark:invert"
              />
            </div>
            <div>
              <h3 className="font-medium">{getSelectedRoleData()?.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getSelectedRoleData()?.description}
              </p>
            </div>
          </div>
          
          {/* Country Summary */}
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Image
                src={getSelectedCountryData()?.flag || ''}
                alt={getSelectedCountryData()?.name || ''}
                width={30}
                height={20}
              />
            </div>
            <div>
              <h3 className="font-medium">{getSelectedCountryData()?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You'll get access to {getSelectedCountryData()?.name} specific resources
              </p>
            </div>
          </div>
          
          {/* Personal Info Summary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Name</h4>
                <p>{name}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Gender</h4>
                <p>{gender === 'MALE' ? 'Male' : 'Female'}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Experience Preview */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            Your Personalized Experience
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-200">
            Based on your selections, your NexusForge experience will be
            tailored for {getSelectedRoleData()?.title}s in {getSelectedCountryData()?.name}.
            You'll see country-specific resources, building codes, and connect with
            relevant professionals.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      {renderStepIndicators()}
      
      <AnimatePresence mode="wait">
        {!formComplete ? (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && renderRoleStep()}
            {currentStep === 2 && renderCountryStep()}
            {currentStep === 3 && renderPersonalInfoStep()}
          </motion.div>
        ) : (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {renderConfirmation()}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="text-sm text-red-600 text-center">{error}</div>
      )}

      <div className="flex justify-between mt-8">
        {currentStep > 1 && !formComplete && (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        )}
        
        {!formComplete ? (
          <button
            type="button"
            onClick={nextStep}
            className={`ml-auto flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={
              (currentStep === 1 && !selectedRole) ||
              (currentStep === 2 && !selectedCountry) ||
              (currentStep === 3 && (!name || !email || !password || !gender))
            }
          >
            {currentStep < 3 ? (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Review'
            )}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        )}
      </div>
    </form>
  )
}